import {Component, OnInit} from '@angular/core';

import {StoreService} from '../../services/store.service';
import {calculateAggregationValues} from '../../utils/math';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-agression',
  templateUrl: './aggregation.component.html',
  styleUrls: ['./aggregation.component.css']
})
export class AggregationComponent implements OnInit {

  loadingError = false;
  barChartType = 'bar';
  barChartLegend = true;
  barChartOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  stocksValues: any;
  stocksLabels: any[];
  stocksData: any[] = [{data: [], label: 'Stocks size'}];

  stocksAccValues: any;
  stocksAccLabels: any[];
  stocksAccData: any[] = [{data: [], label: 'Stock Accuracy (in percent)'}];

  onFloorValues: any;
  onFloorLabels: any[];
  onFloorData: any[] = [{data: [], label: 'On Floor Availability (in percent)'}];

  stockMeanValues: any;
  meanAgesLabels: any[];
  meanAgesData: any[] = [{data: [], label: 'Stock Mean Age (in days)'}];

  constructor(private storeService: StoreService,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.storeService.getStores().subscribe( stores => {
        const totalStocks = stores.map(store => +store.stockBackstore + +store.stockFrontstore + +store.stockShoppingWindow);
        const stockAccuracys = stores.map(store => +store.stockAccuracy * 100);
        const onFloorAvailabilitys = stores.map(store => +store.onFloorAvailability * 100);
        const stockMeanAges = stores.map(store => +store.stockMeanAge);

        this.stocksValues = calculateAggregationValues(totalStocks, 10);
        this.stocksAccValues = calculateAggregationValues(stockAccuracys, 10);
        this.onFloorValues = calculateAggregationValues(onFloorAvailabilitys, 10);
        this.stockMeanValues = calculateAggregationValues(stockMeanAges, 10);

        this.stocksData[0].data = this.stocksValues.hist.data;
        this.stocksLabels = this.stocksValues.hist.labels;

        this.stocksAccData[0].data = this.stocksAccValues.hist.data;
        this.stocksAccLabels = this.stocksAccValues.hist.labels;

        this.onFloorData[0].data = this.onFloorValues.hist.data;
        this.onFloorLabels = this.onFloorValues.hist.labels;

        this.meanAgesData[0].data = this.stockMeanValues.hist.data;
        this.meanAgesLabels = this.stockMeanValues.hist.labels;
      }, (error: any) => {
      const msg = 'An error occurred while loading histograms: ' + error.status + ' - ' + error.statusText;
      this.notifierService.notify( 'error', msg);
      this.loadingError = true;
    });
  }
}
