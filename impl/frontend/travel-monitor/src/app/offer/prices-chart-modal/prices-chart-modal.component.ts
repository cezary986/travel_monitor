import { Component, OnInit, Inject } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Offer } from 'src/app/common/models/offer';
import { OfferEditModalComponent } from '../offer-edit-modal/offer-edit-modal.component';
import { PriceService } from 'src/app/common/services/price.service';
import { Price } from 'src/app/common/models/price';

@Component({
  selector: 'app-prices-chart-modal',
  templateUrl: './prices-chart-modal.component.html',
  styleUrls: ['./prices-chart-modal.component.scss']
})
export class PricesChartModalComponent implements OnInit {

  public loading: boolean = true;

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: null,
    legend: {
      display: false,
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(
    public dialogRef: MatDialogRef<OfferEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Offer,
    private pricesService: PriceService
  ) {

  }

  ngOnInit() {
    this.pricesService.getPrices(this.data.id).subscribe((prices: any) => {
      this.makeChart(prices.results);
    });
  }

  private makeChart(prices: Price[]) {
    this.lineChartData = [{
      data: prices.map((el) => { return el.value; }),
      label: ''
    }];
    this.lineChartLabels = prices.map((el) => { return el.timestamp; })
    this.loading = false;
  }

}
