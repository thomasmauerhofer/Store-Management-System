import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Store} from '../../models/store';
import {StoreService} from '../../services/store.service';
import {NotifierService} from 'angular-notifier';
import {mean} from '../../utils/math';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.component.html',
  styleUrls: ['./store-detail.component.css']
})
export class StoreDetailComponent implements OnInit {

  store: Store;
  loadingStoreError = false;
  loadingValuesError = false;

  barChartType = 'bar';
  barChartLegend  = true;
  barChartOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  stockLabels: string[] = ['Total Stocks'];
  stockData: any[] = [{data: [], label: 'This store'}, {data: [], label: 'Mean over all stores'}];

  stockAccLabels: string[] = ['Stock Accuracy (in percent)'];
  stockAccData: any[] = [{data: [], label: 'This store'}, {data: [], label: 'Mean over all stores'}];

  onFloorLabels: string[] = ['On Floor Availability (in percent)'];
  onFloorData: any[] = [{data: [], label: 'This store'}, {data: [], label: 'Mean over all stores'}];

  meanAgeLabels: string[] = ['Stock Mean Age (in days)'];
  meanAgeData: any[] = [{data: [], label: 'This store'}, {data: [], label: 'Mean over all stores'}];

  constructor(private route: ActivatedRoute,
              private storeService: StoreService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.setStore();

    this.storeService.getStores().subscribe( stores => {
      const totalStocks: number[] = stores.map(store => +store.stockBackstore + +store.stockFrontstore + +store.stockShoppingWindow);
      const stockAccuracys: number[] = stores.map(store => +store.stockAccuracy);
      const onFloorAvailabilitys: number[] = stores.map(store => +store.onFloorAvailability);
      const stockMeanAges: number[] = stores.map(store => +store.stockMeanAge);

      this.stockData[0].data = [+this.store.stockFrontstore + +this.store.stockBackstore + +this.store.stockShoppingWindow];
      this.stockData[1].data = [mean(totalStocks).toFixed(2)];

      this.stockAccData[0].data = [+this.store.stockAccuracy * 100];
      this.stockAccData[1].data = [(mean(stockAccuracys) * 100).toFixed(2)];

      this.onFloorData[0].data = [+this.store.onFloorAvailability * 100];
      this.onFloorData[1].data = [(mean(onFloorAvailabilitys) * 100).toFixed(2)];

      this.meanAgeData[0].data = [+this.store.stockMeanAge];
      this.meanAgeData[1].data = [mean(stockMeanAges).toFixed(2)];
    }, (error: any) => {
      const msg = 'An error occurred while loading histograms: ' + error.status + ' - ' + error.statusText;
      this.notifierService.notify( 'error', msg);
      this.loadingValuesError = true;
    });
  }

  setStore(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.storeService.getStore(id).subscribe((store: Store) => {
      this.store = store;
    }, (error: any) => {
      const msg = 'An error occurred while loading data: ' + error.status + ' - ' + error.statusText;
      this.notifierService.notify( 'error', msg);
      this.loadingStoreError = true;
    });
  }
}
