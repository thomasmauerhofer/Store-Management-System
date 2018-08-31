import { Component, OnInit } from '@angular/core';
import {NotifierService} from 'angular-notifier';

import {Store} from '../../models/store';
import {User, Role} from '../../models/user';
import {StoreService} from '../../services/store.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  admin = Role.Admin;
  user: User;

  PAGESIZE = 10;
  loadingError = false;
  stores: Store[];

  pagedItems: Store[];
  pager: any = {};

  filteredStores: Store[];
  nameInput: string;
  ccInput: string;
  emailInput: string;
  catInput: string;

  constructor(private storeService: StoreService,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.setStores();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  setStores(): void {
    this.storeService.getStores().subscribe(stores => {
      this.stores = stores;
      this.filteredStores = stores;
      this.setPage(1);
    }, (error: any) => {
      const msg = 'An error occurred while loading data: ' + error.status + ' - ' + error.statusText;
      this.notifierService.notify( 'error', msg);
      this.loadingError = true;
    });
  }

  setPage(page: number) {
    this.pager = this.getPager(this.filteredStores.length, page);
    this.pagedItems = this.filteredStores.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  getPager(totalItems: number, currentPage: number = 1) {
    const totalPages = Math.ceil(totalItems / this.PAGESIZE);

    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    const startIndex = (currentPage - 1) * this.PAGESIZE;
    const endIndex = Math.min(startIndex + this.PAGESIZE - 1, totalItems - 1);
    const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    return {
      currentPage: currentPage,
      totalPages: totalPages,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  deleteStore(store: Store): void {
    this.storeService.deleteStore(store.id).subscribe(() => {
      this.stores = this.stores.filter(s => s !== store);
      this.filteredStores = this.filteredStores.filter(s => s !== store);
      this.setPage(this.pager.currentPage);
    }, (error: any) => {
      const msg = 'An error occurred while loading data: ' + error.status + ' - ' + error.statusText;
      this.notifierService.notify( 'error', msg);
      this.loadingError = true;
    });
  }

  filterName() {
    let filteredStores = this.stores;

    for (const store of this.stores) {
      if ((this.nameInput && this.nameInput.length > 0 && !store.name.toLowerCase().includes(this.nameInput.toLowerCase())) ||
        (this.ccInput && this.ccInput.length > 0 && !store.countryCode.toLowerCase().includes(this.ccInput.toLowerCase())) ||
        (this.emailInput && this.emailInput.length > 0 && !store.email.toLowerCase().includes(this.emailInput.toLowerCase())) ||
        (this.catInput && this.catInput.length > 0 && !store.category.toString().includes(this.catInput.toLowerCase()))) {
        filteredStores = filteredStores.filter(obj => obj !== store);
      }
    }

    this.filteredStores = filteredStores;
    this.setPage(1);
  }
}
