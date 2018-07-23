import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Vendor }         from '../vendor';
import { Product } from '../product';

import { SettingsService }  from '../settings.service';
import { VendorService }  from '../vendor.service';
import { MoneyService } from '../money.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html',
  styleUrls: [ './vendor-detail.component.css' ]
})
export class VendorDetailComponent implements OnInit {
  @Input() vendor: Vendor;
  settings: Object;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private vendorService: VendorService,
    private settingsService: SettingsService,
    private moneyService: MoneyService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getSettings();
    this.getVendor();
  }

  getSettings(): void {
    this.settingsService.getSettings()
      .subscribe(settings => this.settings = settings);
  }

  getVendor(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.vendorService.getVendor(id)
      .subscribe(vendor => this.vendor = vendor);
  }

  addCoin(id: number) {
    this.moneyService.addCoin(this.vendor.money, id);
  }

  removeCoin(id: number) {
    this.moneyService.removeCoin(this.vendor.money, id);
  }

  addProduct(title: string, cost: number, quantity: number): void {

    /* !!! Correct number input and checking on refactoring */
    cost = Number.parseInt(cost);
    quantity = Number.parseInt(quantity);
    /* !!! Correct number input and checking on refactoring */

    if (this.vendor.store.filter(x => x.title == title).length > 0) {
      this.messageService.add('Error: the product already exists');
    } else if (title && cost >= 0 && quantity >= 0) {
      this.vendor.store.push({title: title, cost: cost, quantity: quantity} as Product);
      this.vendorService.updateVendor(this.vendor);
    } else if (!title) {
      this.messageService.add('Error: input title of the product');
    } else if (!Number.isFinite(cost) || cost < 0) {
      this.messageService.add('Error: wrong cost of the product');
    } else if (!Number.isFinite(quantity) || quantity < 0) {
      this.messageService.add('Error: wrong quantity of the product');
    }
  } 

  deleteProduct(i): void {
    this.vendor.store.splice(i);
    this.vendorService.updateVendor(this.vendor);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.vendorService.updateVendor(this.vendor)
      .subscribe(() => this.goBack());
  }
  
}