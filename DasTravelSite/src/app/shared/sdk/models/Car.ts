/* tslint:disable */
import {
  RentalService
} from '../index';

declare var Object: any;
export interface CarInterface {
  "make": string;
  "registration": string;
  "seats": number;
  "category": string;
  "rating"?: number;
  "ratingCount"?: number;
  "id"?: any;
  "rentalServiceId"?: any;
  rentalService?: RentalService;
}

export class Car implements CarInterface {
  "make": string;
  "registration": string;
  "seats": number;
  "category": string;
  "rating": number;
  "ratingCount": number;
  "id": any;
  "rentalServiceId": any;
  rentalService: RentalService;
  constructor(data?: CarInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Car`.
   */
  public static getModelName() {
    return "Car";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Car for dynamic purposes.
  **/
  public static factory(data: CarInterface): Car{
    return new Car(data);
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
      name: 'Car',
      plural: 'Cars',
      path: 'Cars',
      idName: 'id',
      properties: {
        "make": {
          name: 'make',
          type: 'string'
        },
        "registration": {
          name: 'registration',
          type: 'string'
        },
        "seats": {
          name: 'seats',
          type: 'number'
        },
        "category": {
          name: 'category',
          type: 'string'
        },
        "rating": {
          name: 'rating',
          type: 'number',
          default: 0
        },
        "ratingCount": {
          name: 'ratingCount',
          type: 'number',
          default: 0
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "rentalServiceId": {
          name: 'rentalServiceId',
          type: 'any'
        },
      },
      relations: {
        rentalService: {
          name: 'rentalService',
          type: 'RentalService',
          model: 'RentalService',
          relationType: 'belongsTo',
                  keyFrom: 'rentalServiceId',
          keyTo: 'id'
        },
      }
    }
  }
}
