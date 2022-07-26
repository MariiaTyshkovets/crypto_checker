import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../service/api.service';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

  coinData : any;
  coinId! : string;
  days : number = 1;
  currency : string = 'UAH';
  currentPrice : number = 0;
  currentMarketCap : number = 0;


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Price Trends',
        backgroundColor: 'rgba(148, 159, 177, 0.2)',
        borderColor: '#3f51b5',
        pointBackgroundColor: '#3f51b5',
        pointBorderColor: '#3f51b5',
        pointHoverBackgroundColor: '#3f51b5',
        pointHoverBorderColor: '#3f51b5'
      }
    ],
    labels: []
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  }

  public lineChartType: ChartType = 'line'; 
  
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;

  constructor(private api : ApiService, private activatedRoute : ActivatedRoute, private currencyService : CurrencyService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val => {
      this.coinId = val['id'];
    });
    this.getCoinData();
    this.getGraphData(this.days);
    this.currencyService.getCurrency()
    .subscribe(val => {
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    })
  }

  getCoinData() {
    this.api.getCurrencyById(this.coinId)
    .subscribe(res => {
      this.coinData = res;
      if (this.currency === "UAH") {
        this.currentPrice = res.market_data.current_price.uah;
        this.currentMarketCap = res.market_data.market_cap.uah;
      }
      if (this.currency === "USD") {
        this.currentPrice = res.market_data.current_price.usd;
        this.currentMarketCap = res.market_data.market_cap.usd;
      }
    })
  }

  getGraphData(days : number) {
    this.days = days;
    this.api.getGraficalCurrencyData(this.coinId, this.currency, this.days)
    .subscribe(res => {
      setTimeout(() => {
        this.myLineChart.chart?.update();
      }, 200)
      this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
        return a[1];
      });
      this.lineChartData.labels = res.prices.map((a: any) => {
        let date = new Date(a[0]);
        let hours = date.getHours().toString().length === 2 ? date.getHours() : '0' + date.getHours();
        let minutes = date.getMinutes().toString().length === 2 ? date.getMinutes() : '0' + date.getMinutes();
        let time = `${hours}:${minutes}`;
        return this.days === 1 ? time : date.toLocaleDateString();
      }) 
    })
  }
}
