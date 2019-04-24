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
import { DiscountOffer } from '../../models/DiscountOffer';
import { CarPrice } from '../../models/CarPrice';
import { Email } from '../../models/Email';
import { Myuser } from '../../models/Myuser';
import { UserInfo } from '../../models/UserInfo';

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
    DiscountOffer: DiscountOffer,
    CarPrice: CarPrice,
    Email: Email,
    Myuser: Myuser,
    UserInfo: UserInfo,
    
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
