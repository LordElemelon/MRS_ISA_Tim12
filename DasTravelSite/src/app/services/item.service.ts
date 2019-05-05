import { Injectable } from '@angular/core';
import { Car } from '../shared/sdk';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  toReserve: Car;

  setReservableCar(car: Car) {
    this.toReserve = car;
  }

  getReservableCar() {
    return this.toReserve;
  }

}
