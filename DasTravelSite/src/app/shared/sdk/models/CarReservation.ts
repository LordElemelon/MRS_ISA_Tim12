/* tslint:disable */

declare var Object: any;
export interface CarReservationInterface {
  "startDate": Date;
  "endDate": Date;
  "price": number;
  "carsId": string;
  "myuserId"?: string;
  "isSpecialOffer": boolean;
  "rentalServiceId": string;
  "rated"?: boolean;
  "id"?: number;
}

export class CarReservation implements CarReservationInterface {
  "startDate": Date;
  "endDate": Date;
  "price": number;
  "carsId": string;
  "myuserId": string;
  "isSpecialOffer": boolean;
  "rentalServiceId": string;
  "rated": boolean;
  "id": number;
  constructor(data?: CarReservationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CarReservation`.
   */
  public static getModelName() {
    return "CarReservation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CarReservation for dynamic purposes.
  **/
  public static factory(data: CarReservationInterface): CarReservation{
    return new CarReservation(data);
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
      name: 'CarReservation',
      plural: 'CarReservations',
      path: 'CarReservations',
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
        "price": {
          name: 'price',
          type: 'number'
        },
        "carsId": {
          name: 'carsId',
          type: 'string'
        },
        "myuserId": {
          name: 'myuserId',
          type: 'string'
        },
        "isSpecialOffer": {
          name: 'isSpecialOffer',
          type: 'boolean'
        },
        "rentalServiceId": {
          name: 'rentalServiceId',
          type: 'string'
        },
        "rated": {
          name: 'rated',
          type: 'boolean',
          default: false
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
