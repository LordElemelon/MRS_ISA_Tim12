/* tslint:disable */
import {
  Car,
  Myuser,
  RentalService,
  CarReservation
} from '../index';

declare var Object: any;
export interface CarSpecialOfferInterface {
  "startDate": Date;
  "endDate": Date;
  "basePrice": number;
  "discount": number;
  "registration": string;
  "id"?: number;
  "carsId"?: any;
  "myuserId"?: any;
  "rentalServiceId"?: any;
  "carReservationsId"?: number;
  cars?: Car;
  myuser?: Myuser;
  rentalService?: RentalService;
  carReservations?: CarReservation;
}

export class CarSpecialOffer implements CarSpecialOfferInterface {
  "startDate": Date;
  "endDate": Date;
  "basePrice": number;
  "discount": number;
  "registration": string;
  "id": number;
  "carsId": any;
  "myuserId": any;
  "rentalServiceId": any;
  "carReservationsId": number;
  cars: Car;
  myuser: Myuser;
  rentalService: RentalService;
  carReservations: CarReservation;
  constructor(data?: CarSpecialOfferInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CarSpecialOffer`.
   */
  public static getModelName() {
    return "CarSpecialOffer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CarSpecialOffer for dynamic purposes.
  **/
  public static factory(data: CarSpecialOfferInterface): CarSpecialOffer{
    return new CarSpecialOffer(data);
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
      name: 'CarSpecialOffer',
      plural: 'CarSpecialOffers',
      path: 'CarSpecialOffers',
      idName: 'id',
      properties: {
        "startDate": {
          name: 'startDate',
          type: 'Date'
        },
        "endDate": {
          name: 'endDate',
          type: 'Date'
        },
        "basePrice": {
          name: 'basePrice',
          type: 'number'
        },
        "discount": {
          name: 'discount',
          type: 'number'
        },
        "registration": {
          name: 'registration',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "carsId": {
          name: 'carsId',
          type: 'any'
        },
        "myuserId": {
          name: 'myuserId',
          type: 'any'
        },
        "rentalServiceId": {
          name: 'rentalServiceId',
          type: 'any'
        },
        "carReservationsId": {
          name: 'carReservationsId',
          type: 'number'
        },
      },
      relations: {
        cars: {
          name: 'cars',
          type: 'Car',
          model: 'Car',
          relationType: 'belongsTo',
                  keyFrom: 'carsId',
          keyTo: 'id'
        },
        myuser: {
          name: 'myuser',
          type: 'Myuser',
          model: 'Myuser',
          relationType: 'belongsTo',
                  keyFrom: 'myuserId',
          keyTo: 'id'
        },
        rentalService: {
          name: 'rentalService',
          type: 'RentalService',
          model: 'RentalService',
          relationType: 'belongsTo',
                  keyFrom: 'rentalServiceId',
          keyTo: 'id'
        },
        carReservations: {
          name: 'carReservations',
          type: 'CarReservation',
          model: 'CarReservation',
          relationType: 'belongsTo',
                  keyFrom: 'carReservationsId',
          keyTo: 'id'
        },
      }
    }
  }
}
