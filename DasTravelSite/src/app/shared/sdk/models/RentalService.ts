/* tslint:disable */
import {
  Branch,
  Car,
  CarPrice
} from '../index';

declare var Object: any;
export interface RentalServiceInterface {
  "name": string;
  "address": string;
  "description": string;
  "id"?: any;
  branches?: Branch[];
  cars?: Car[];
  carPrices?: CarPrice[];
}

export class RentalService implements RentalServiceInterface {
  "name": string;
  "address": string;
  "description": string;
  "id": any;
  branches: Branch[];
  cars: Car[];
  carPrices: CarPrice[];
  constructor(data?: RentalServiceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RentalService`.
   */
  public static getModelName() {
    return "RentalService";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RentalService for dynamic purposes.
  **/
  public static factory(data: RentalServiceInterface): RentalService{
    return new RentalService(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'RentalService',
      plural: 'RentalServices',
      path: 'RentalServices',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "address": {
          name: 'address',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        branches: {
          name: 'branches',
          type: 'Branch[]',
          model: 'Branch',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'rentalServiceId'
        },
        cars: {
          name: 'cars',
          type: 'Car[]',
          model: 'Car',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'rentalServiceId'
        },
        carPrices: {
          name: 'carPrices',
          type: 'CarPrice[]',
          model: 'CarPrice',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'rentalServiceId'
        },
      }
    }
  }
}
