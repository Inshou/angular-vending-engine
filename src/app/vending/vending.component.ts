import { Component, OnInit } from '@angular/core';

import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
import { SettingsService }  from '../settings.service';
import { MoneyService } from '../money.service';

@Component({
  selector: 'app-vending',
  templateUrl: './vending.component.html',
  styleUrls: [ './vending.component.css' ]
})
export class VendingComponent implements OnInit {
  settings: Object;
  vendor: Vendor;
  customer: Vendor;

  constructor(
    private settingsService: SettingsService,
    private vendorService: VendorService,
    private moneyService: MoneyService
  ) {  }

  ngOnInit() { 
    this.getSettings();
  }

  /* Engine initialization */

  /* Load settings */
  getSettings(): void {
    this.settingsService.getSettings()
      .subscribe(
        settings => {
          this.settings = settings;
          this.getVendor(settings['defaultVendorId']);
          this.getCustomer(settings['defaultCustomerId']);
        }
      );
  }

  /* Load vendors */
  getVendor(id: number): void {
    this.vendorService.getVendor(id)
      .subscribe(vendor => this.vendor = vendor);
  }
  getCustomer(id: number): void {
    this.vendorService.getVendor(id)
      .subscribe(customer => this.customer = customer);
  }

  /* Operations */
  useCoin(index: number): void {
    if ( this.moneyService.removeCoin(this.customer.money, index) ) {
      this.moneyService.addCoin(this.vendor.money, index);
      this.vendor['deposite'] += this.settings['coins'][index].value;
    }   
  }
  buyProduct(id: number): void {
    this.vendorService.buyProduct(this.vendor, this.customer, id).forEach( (vendor) => {
      vendor.subscribe();
    }); 
  }
  getMoneyBack(): void {
    this.vendorService.getMoneyBack(this.vendor, this.customer).forEach( (vendor) => {
      vendor.subscribe();
    })
  }

}