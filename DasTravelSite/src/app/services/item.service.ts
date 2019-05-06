import { Injectable } from '@angular/core';
import { Car, CarPrice } from '../shared/sdk';
import { CarPriceApi } from '../shared/sdk/services'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private carPriceService : CarPriceApi) { }

  toReserve: Car;

  carPrices: CarPrice[];

  setReservableCar(car: Car) {
    this.toReserve = car;
  }

  getReservableCar() {
    return this.toReserve;
  }

  getPrices() {
    const my_observable = new Observable(observer => {
      if (this.carPrices) {
        observer.next(this.carPrices);
      } else {
        this.carPriceService.find()
        .subscribe(
          (result) => {
            this.carPrices = result as CarPrice[];
            observer.next(this.carPrices);
          },
          (err) => {
            observer.next(null);
          }
        )
      }
    });
    return my_observable;
  }



}
