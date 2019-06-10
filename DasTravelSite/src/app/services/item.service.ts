import { Injectable } from '@angular/core';
import { Car, CarPrice, RentalService } from '../shared/sdk';
import { CarPriceApi } from '../shared/sdk/services'
import { Observable } from 'rxjs';
import { RentalServiceApi } from '../shared/sdk/services'; 

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private carPriceService : CarPriceApi,
   private rentalServiceService: RentalServiceApi) { 
  }

  toReserve;
  roomToReserve: any;
  carPrices: CarPrice[] = [];
  serviceId;
  hotelId;
  carSpecialOffer;

  carReservationIdForRate;
  roomReservationIdForRate;

  setCarReservationIdForRate(value) {
    this.carReservationIdForRate = value;
  }

  getCarReservationIdForRate() {
    return this.carReservationIdForRate;
  }
  
  setRoomReservationIdForRate(value) {
    this.roomReservationIdForRate = value;
  }

  getRoomReservationIdForRate() {
    return this.roomReservationIdForRate;
  }

  setReservableCar(car) {
    this.toReserve = car;
  }

  getReservableCar() {
    return this.toReserve;
  }

  setServiceId(id) {
   this.serviceId = id;
  }

  getServiceId() {
    return this.serviceId;
  }

  setHotelId(id) {
    this.hotelId = id;
  }

  getHotelId() {
    return this.hotelId;
  }
  
  setCarSpecialOffer(specialOffer) {
    this.carSpecialOffer = specialOffer;
  }

  getCarSpecialOffer() {
    return this.carSpecialOffer;
  }

  getPrices() {
    const my_observable = new Observable(observer => {
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
