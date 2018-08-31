import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NotifierService} from 'angular-notifier';

import {Store} from '../../models/store';
import {StoreService} from '../../services/store.service';

@Component({
  selector: 'app-store-edit',
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.css'],
})
export class StoreEditComponent implements OnInit {

  loadingError = false;
  store: Store;

  constructor(private route: ActivatedRoute,
              private storeService: StoreService,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.setStore();
  }

  setStore(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.storeService.getStore(id).subscribe(store => {
      this.store = store;
    }, (error: any) => {
      const msg = 'An error occurred while loading data: ' + error.status + ' - ' + error.statusText;
      this.notifierService.notify( 'error', msg);
      this.loadingError = true;
    });
  }

  onSubmit(): void {
    this.storeService.updateStore(this.store)
      .subscribe(() => {
        this.notifierService.notify( 'success', 'Store has been updated successfully');
      }, (error: any) => {
        const msg = 'An error occurred while updating store: ' + error.status + ' - ' + error.statusText;
        this.notifierService.notify( 'error', msg);
      });
  }
}
