/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Hotel } from '../../models/Hotel';
import { Room } from '../../models/Room';
import { RentalService } from '../../models/RentalService';
import { Branch } from '../../models/Branch';
import { Car } from '../../models/Car';

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
