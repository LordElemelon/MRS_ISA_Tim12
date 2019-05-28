/* tslint:disable */

declare var Object: any;
export interface RoomReservationInterface {
  "startDate": Date;
  "endDate": Date;
  "price": number;
  "roomId": string;
  "hotelId": string;
  "myuserId"?: string;
  "hotelDiscountId"?: string;
  "rated"?: boolean;
  "id"?: number;
}

export class RoomReservation implements RoomReservationInterface {
  "startDate": Date;
  "endDate": Date;
  "price": number;
  "roomId": string;
  "hotelId": string;
  "myuserId": string;
  "hotelDiscountId": string;
  "rated": boolean;
  "id": number;
  constructor(data?: RoomReservationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RoomReservation`.
   */
  public static getModelName() {
    return "RoomReservation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RoomReservation for dynamic purposes.
  **/
  public static factory(data: RoomReservationInterface): RoomReservation{
    return new RoomReservation(data);
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
      name: 'RoomReservation',
      plural: 'RoomReservations',
      path: 'RoomReservations',
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
        "roomId": {
          name: 'roomId',
          type: 'string'
        },
        "hotelId": {
          name: 'hotelId',
          type: 'string'
        },
        "myuserId": {
          name: 'myuserId',
          type: 'string'
        },
        "hotelDiscountId": {
          name: 'hotelDiscountId',
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
