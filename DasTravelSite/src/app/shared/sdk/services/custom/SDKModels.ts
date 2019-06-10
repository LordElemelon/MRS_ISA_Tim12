/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Hotel } from '../../models/Hotel';
import { Room } from '../../models/Room';
import { RentalService } from '../../models/RentalService';
import { Branch } from '../../models/Branch';
import { Car } from '../../models/Car';
import { Airline } from '../../models/Airline';
import { Flight } from '../../models/Flight';
import { RoomPrice } from '../../models/RoomPrice';
import { HotelSpecialOffer } from '../../models/HotelSpecialOffer';
import { HotelDiscount } from '../../models/HotelDiscount';
import { CarPrice } from '../../models/CarPrice';
import { Email } from '../../models/Email';
import { Myuser } from '../../models/Myuser';
import { CarReservation } from '../../models/CarReservation';
import { Carid } from '../../models/Carid';
import { Roomid } from '../../models/Roomid';
import { RoomReservation } from '../../models/RoomReservation';
import { UserInfo } from '../../models/UserInfo';
import { Seat } from '../../models/Seat';
import { SeatId } from '../../models/SeatId';
import { SeatReservation } from '../../models/SeatReservation';
import { CarSpecialOffer } from '../../models/CarSpecialOffer';
import { QuickFlightReservation } from '../../models/QuickFlightReservation';
import { Friendship } from '../../models/Friendship';
import { ReservationOffer } from '../../models/ReservationOffer';
import { Location } from '../../models/Location';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Hotel: Hotel,
    Room: Room,
    RentalService: RentalService,
    Branch: Branch,
    Car: Car,
    Airline: Airline,
    Flight: Flight,
    RoomPrice: RoomPrice,
    HotelSpecialOffer: HotelSpecialOffer,
    HotelDiscount: HotelDiscount,
    CarPrice: CarPrice,
    Email: Email,
    Myuser: Myuser,
    CarReservation: CarReservation,
    Carid: Carid,
    Roomid: Roomid,
    RoomReservation: RoomReservation,
    UserInfo: UserInfo,
    Seat: Seat,
    SeatId: SeatId,
    SeatReservation: SeatReservation,
    CarSpecialOffer: CarSpecialOffer,
    QuickFlightReservation: QuickFlightReservation,
    Friendship: Friendship,
    ReservationOffer: ReservationOffer,
    Location: Location,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
