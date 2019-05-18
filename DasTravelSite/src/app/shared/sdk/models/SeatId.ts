/* tslint:disable */
import {
  Seat
} from '../index';

declare var Object: any;
export interface SeatIdInterface {
  "id"?: number;
  "seatId"?: any;
  seat?: Seat;
}

export class SeatId implements SeatIdInterface {
  "id": number;
  "seatId": any;
  seat: Seat;
  constructor(data?: SeatIdInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SeatId`.
   */
  public static getModelName() {
    return "SeatId";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SeatId for dynamic purposes.
  **/
  public static factory(data: SeatIdInterface): SeatId{
    return new SeatId(data);
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
      name: 'SeatId',
      plural: 'SeatIds',
      path: 'SeatIds',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "seatId": {
          name: 'seatId',
          type: 'any'
        },
      },
      relations: {
        seat: {
          name: 'seat',
          type: 'Seat',
          model: 'Seat',
          relationType: 'belongsTo',
                  keyFrom: 'seatId',
          keyTo: 'id'
        },
      }
    }
  }
}
