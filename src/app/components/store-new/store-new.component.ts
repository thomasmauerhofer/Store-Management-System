import { Component, OnInit } from '@angular/core';
import {NotifierService} from 'angular-notifier';

import {Store} from '../../models/store';
import {StoreService} from '../../services/store.service';


@Component({
  selector: 'app-store-new',
  templateUrl: './store-new.component.html',
  styleUrls: ['./store-new.component.css']
})
export class StoreNewComponent implements OnInit {
  model: any = { stockMeanAge: '', onFloorAvailability: '', stockAccuracy: '', stockBackstore: '', stockFrontstore: '',
                  stockShoppingWindow: ''};

  constructor(private storeService: StoreService,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
  }

  onSubmit(f: any): void {
    this.storeService.addStore(this.model as Store)
      .subscribe(() => {
        this.notifierService.notify( 'success', 'Store has been saved successfully');
        f.form.reset();
        f.submitted = false;
      }, (error: any) => {
        const msg = 'An error occurred while saving store: ' + error.status + ' - ' + error.statusText;
        this.notifierService.notify( 'error', msg);
      });
  }
}
