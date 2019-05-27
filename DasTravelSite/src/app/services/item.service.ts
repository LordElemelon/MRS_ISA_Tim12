import { Injectable } from '@angular/core';
import { Car, CarPrice } from '../shared/sdk';
import { CarPriceApi } from '../shared/sdk/services'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private carPriceService : CarPriceApi) { }

  toReserve;
  roomToReserve: any;
  carPrices: CarPrice[] = [];
  carSpecialOffer;

  carReservationIdForRate;

  setCarReservationIdForRate(value) {
    this.carReservationIdForRate = value;
  }

  getCarReservationIdForRate() {
    return this.carReservationIdForRate;
  }

  setReservableCar(car) {
    this.toReserve = car;
  }

  getReservableCar() {
    return this.toReserve;
  }

  setCarSpecialOffer(specialOffer) {
    this.carSpecialOffer = specialOffer;
  }

  getCarSpecialOffer() {
    return this.carSpecialOffer;
  }

  getPrices() {
    const my_observable = new Observable(observer => {
      if (this.carPrices.length != 0) {
        observer.next(this.carPrices);
      } else {
        this.carPriceService.find()
        .subscribe(
          (result) => {
            this.carPrices = result as CarPrice[];
            for (let price of this.carPrices) {
              price.start = new Date(price.start);
            }
            observer.next(this.carPrices);
          },
          (err) => {
            observer.next([]);
          }
        )
      }
    });
    return my_observable;
  }
  setReservableRoom(room: any) {
    this.roomToReserve = room;
  }

  getReservableRoom() {
    return this.roomToReserve;
  }
}
