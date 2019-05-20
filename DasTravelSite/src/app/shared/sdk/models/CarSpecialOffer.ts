/* tslint:disable */

declare var Object: any;
export interface CarSpecialOfferInterface {
  "startDate": Date;
  "endDate": Date;
  "basePrice": number;
  "discount": number;
  "registration": string;
  "carsId": string;
  "myuserId"?: string;
  "rentalServiceId": string;
  "carReservationsId": string;
  "id"?: number;
}

export class CarSpecialOffer implements CarSpecialOfferInterface {
  "startDate": Date;
  "endDate": Date;
  "basePrice": number;
  "discount": number;
  "registration": string;
  "carsId": string;
  "myuserId": string;
  "rentalServiceId": string;
  "carReservationsId": string;
  "id": number;
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
        "carsId": {
          name: 'carsId',
          type: 'string'
        },
        "myuserId": {
          name: 'myuserId',
          type: 'string'
        },
        "rentalServiceId": {
          name: 'rentalServiceId',
          type: 'string'
        },
        "carReservationsId": {
          name: 'carReservationsId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
