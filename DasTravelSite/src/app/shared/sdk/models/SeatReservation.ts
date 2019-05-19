/* tslint:disable */

declare var Object: any;
export interface SeatReservationInterface {
  "price": number;
  "myuserId": string;
  "seatId": string;
  "id"?: number;
}

export class SeatReservation implements SeatReservationInterface {
  "price": number;
  "myuserId": string;
  "seatId": string;
  "id": number;
  constructor(data?: SeatReservationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SeatReservation`.
   */
  public static getModelName() {
    return "SeatReservation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SeatReservation for dynamic purposes.
  **/
  public static factory(data: SeatReservationInterface): SeatReservation{
    return new SeatReservation(data);
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
      name: 'SeatReservation',
      plural: 'SeatReservations',
      path: 'SeatReservations',
      idName: 'id',
      properties: {
        "price": {
          name: 'price',
          type: 'number'
        },
        "myuserId": {
          name: 'myuserId',
          type: 'string'
        },
        "seatId": {
          name: 'seatId',
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
