import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { SettingsService } from './settings.service';

import { Money } from './money';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {
  settings: Object;

  constructor(
    private messageService: MessageService,
    private settingsService: SettingsService
  ) { 
    this.getSettings();
  }

  getSettings() {
    return this.settingsService.getSettings()
      .subscribe(settings => this.settings = settings);
  }

  /** ADD: update money object **/
  addCoin(money: Money, id: number): void {
    money.money[id]++;   
  }
  /** REMOVE: update money object **/
  removeCoin(money: Money, id: number): Boolean {
    let coinTitle = this.settings['coins'][id].title;
    if (money.money[id] != 0) {
      money.money[id]--;
      return true;
    } else { 
      this.log('Error: no more "'+ coinTitle +'" coins'); 
      return false;
    }
  }

  getTotal(money: Money) {
    let total = 0;
    /* This loop slower than while loop in reverse (change on refactoring) */
    money.money.forEach( (coins, index) => {
      total += coins * this.settings['coins'][index].value;
    })
    return total;
  }

  sumMoney(first: Money, second: Money): Money {
    let i = second.money.length;
    while(i--){
      first.money[i] += second.money[i];
    }
    return first;
  }

  subMoney(money: Money, value: number): any {
    if (this.getTotal(money) >= value) {
      let moneyClone: Money = {id: NaN, money: []};
      let moneyDeposite: Money = {id: NaN, money: []};
      
      moneyClone.money = money.money.slice();     
      
      let i = moneyClone.money.length;
      if ( value > 0 ) {
        while(i--){

          /* If current itaration coins enough */
          if (value % this.settings['coins'][i].value == 0
            && value <= this.settings['coins'][i].value * moneyClone.money[i] ) {           
            
            moneyDeposite.money[i] = value / this.settings['coins'][i].value;
            moneyClone.money[i] -= value / this.settings['coins'][i].value;
            value = 0;
            
            /* Null other iteration coins */
            if (i > 0) {
              while(i--) { moneyDeposite.money[i] = 0; }
            }           

            /* Change master money object */
            money.money = moneyClone.money;

            return [money, moneyDeposite];
          }

          /* If current itaration coins not enough */
          /* and current coins % value = 0 */
          else if (value % this.settings['coins'][i].value == 0
            && value > this.settings['coins'][i].value * moneyClone.money[i]) {
            
            moneyDeposite.money[i] = moneyClone.money[i];
            moneyClone.money[i] = 0;
            value -= this.settings['coins'][i].value * moneyClone.money[i];
          }

          /* If current iteration coins not enough */
          /* and current coins % value > 0 */
          if (value % this.settings['coins'][i].value > 0 
            && value > this.settings['coins'][i].value * moneyClone.money[i]) {

            moneyDeposite.money[i] = moneyClone.money[i]
            moneyClone.money[i] = 0;
            value -= this.settings['coins'][i].value * moneyClone.money[i];
          }
          
          /* If current iteration coins enough */
          /* but current coins % value > 0 */
          if (value % this.settings['coins'][i].value > 0 
            && value < this.settings['coins'][i].value * moneyClone.money[i]) {
            
            moneyDeposite.money[i] = Math.floor(value / this.settings['coins'][i].value);
            moneyClone.money[i] -= Math.floor(value / this.settings['coins'][i].value);
            value -= Math.floor(value / this.settings['coins'][i].value) * this.settings['coins'][i].value;
          }
        }

        /* if operation not successful */
        this.log('Error: operation failed - does not have enough coins');
        return false

      } else {
        this.log('Error: operation failed - deposite is null');
        return false;
      }
      
    } else {
      this.log('Error: operation failed - doesn`t enough money');
      return false;
    }
  }

  /** Log a MoneyService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MoneyService: ${message}`);
  }
}
