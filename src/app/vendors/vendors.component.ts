import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { Money } from '../money';
import { VendorService } from '../vendor.service';
import { SettingsService} from '../settings.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[];
  settings: Object;
  

  constructor(
    private vendorService: VendorService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.getSettings();
    this.getVendors();
  }

  getVendors(): void {
    this.vendorService.getVendors()
        .subscribe(vendors => this.vendors = vendors);
  }

  getSettings(): void {
    this.settingsService.getSettings()
      .subscribe(settings => this.settings = settings);
  }

  add(name: string): void {
    name = name.trim();
    let money = this.settings['defaultMoney'];
    let store = [];
    if (!name) { return; }
    this.vendorService.addVendor({ name: name, money: { money } as Money, store: store } as Vendor)
      .subscribe(vendor => {
        this.vendors.push(vendor);
      });
  }

  delete(vendor: Vendor): void {
    this.vendors = this.vendors.filter(h => h !== vendor);
    this.vendorService.deleteVendor(vendor).subscribe();
  }
}
