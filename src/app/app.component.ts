import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'crypto-checker';
  selectedMoney: string = 'UAH';
  constructor(private currencyService : CurrencyService, private router : Router){}

  sendCurrencyMoney(event: string) {
    console.log(event);
    this.currencyService.setCurrency(event);
  }

  goToStart() {
    this.router.navigate(['coin-list']);
  }
}
