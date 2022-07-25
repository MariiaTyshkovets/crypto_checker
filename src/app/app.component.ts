import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'crypto-checker';
  selectedMoney: string = 'UAH';
  constructor(){}

  sendCurrencyMoney(event: any) {
    console.log(event);
  }
}
