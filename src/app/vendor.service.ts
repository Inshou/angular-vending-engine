import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { catchError, map, tap, combineLatest } from 'rxjs/operators';

import { Vendor } from './vendor';
// import { Money } from './money';
import { Product } from './product';

import { MessageService } from './message.service';
import { SettingsService} from './settings.service';
import { MoneyService } from './money.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class VendorService {
  settings: Object;

  private vendorsUrl = 'api/vendors';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private settingsService: SettingsService,
    private moneyService: MoneyService
  ) { 
    this.getSettings();
  }

  /** GET settings from server **/
  getSettings(): void {
    this.settingsService.getSettings()
      .subscribe(settings => this.settings = settings);
  }
  
  /** GET vendors from the server */
  getVendors (): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.vendorsUrl)
      .pipe(
        // tap(vendors => this.log('fetched vendors')),
        catchError(this.handleError('getVendors', []))
      );
  }

  /** GET vendor by id. Return `undefined` when id not found */
  getVendorNo404<Data>(id: number): Observable<Vendor> {
    const url = `${this.vendorsUrl}/?id=${id}`;
    return this.http.get<Vendor[]>(url)
      .pipe(
        map(vendors => vendors[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} vendor id=${id}`);
        }),
        catchError(this.handleError<Vendor>(`getVendor id=${id}`))
      );
  }

  /** GET vendor by id. Will 404 if id not found */
  getVendor(id: number): Observable<Vendor> {
    const url = `${this.vendorsUrl}/${id}`;
    return this.http.get<Vendor>(url).pipe(
      // tap(_ => this.log(`fetched vendor id=${id}`)),
      catchError(this.handleError<Vendor>(`getVendor id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new vendor to the server */
  addVendor (vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(this.vendorsUrl, vendor, httpOptions).pipe(
      // tap((vendor: Vendor) => this.log(`added vendor id=${vendor.id}`)),
      catchError(this.handleError<Vendor>('addVendor')),
    );
  }

  /** DELETE: delete the vendor from the server */
  deleteVendor (vendor: Vendor | number): Observable<Vendor> {
    const id = typeof vendor === 'number' ? vendor : vendor.id;
    const url = `${this.vendorsUrl}/${id}`;

    return this.http.delete<Vendor>(url, httpOptions).pipe(
      // tap(_ => this.log(`deleted vendor id=${id}`)),
      catchError(this.handleError<Vendor>('deleteVendor'))
    );
  }

  /** PUT: update the vendor on the server */
  updateVendor (vendor: Vendor): Observable<Vendor> {
    return this.http.put(this.vendorsUrl, vendor, httpOptions).pipe(
      // tap(_ => this.log(`updated vendor id=${vendor.id}`)),
      catchError(this.handleError<any>('updateVendor'))
    );
  }

  //////// Money methods //////////
  getMoneyBack(vendor: Vendor, customer: Vendor): Observable<Vendor>[] {
    let result = this.moneyService.subMoney(vendor.money, vendor.deposite);   
    if (result) {
      vendor.money = result[0];
      customer.money = this.moneyService.sumMoney(customer.money, result[1]);
      vendor.deposite = 0;
      this.log('Thank you! Your money was successfully added to your wallet');
    } 
    return [this.updateVendor(vendor), this.updateVendor(customer)];
  }

  //////// Product methods //////////
  buyProduct(vendor: Vendor, customer: Vendor, productId: number): Observable<Vendor>[] {
    let productIndex = vendor.store.findIndex(i => i.id === productId);

    if (vendor.store[productIndex].cost <= vendor.deposite
        && vendor.store[productIndex].quantity >= 1) {
      
      vendor.deposite -= vendor.store[productIndex].cost;
      vendor.store[productIndex].quantity--;
      
      /* Push product in customer store by title */
      let productOutIndex = customer.store.findIndex(i => i.title === vendor.store[productIndex].title);
      if (customer.store[productOutIndex]) {
         customer.store[productOutIndex].quantity++;
      } else {
         let productOut: Product = Object.assign({}, vendor.store[productIndex]);
         productOut.quantity = 1;
         customer.store.push(productOut);
      }
      this.log('Thank you! The product was successfully purchased.');
    } else if (vendor.store[productIndex].quantity <= 0) {
      this.log('Error: this product has expired');
    } else if (vendor.store[productIndex].cost > vendor.deposite) {
      this.log('Error: not enough money');
    }
    return [this.updateVendor(vendor), this.updateVendor(customer)];
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a VendorService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`VendorService: ${message}`);
  }
}