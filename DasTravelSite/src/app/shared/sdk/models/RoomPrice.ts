/* tslint:disable */
import {
  Hotel,
  Room
} from '../index';

declare var Object: any;
export interface RoomPriceInterface {
  "price": number;
  "startDate": Date;
  "id"?: any;
  "hotelId"?: any;
  "roomId"?: any;
  hotel?: Hotel;
  room?: Room;
}

export class RoomPrice implements RoomPriceInterface {
  "price": number;
  "startDate": Date;
  "id": any;
  "hotelId": any;
  "roomId": any;
  hotel: Hotel;
  room: Room;
  constructor(data?: RoomPriceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RoomPrice`.
   */
  public static getModelName() {
    return "RoomPrice";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RoomPrice for dynamic purposes.
  **/
  public static factory(data: RoomPriceInterface): RoomPrice{
    return new RoomPrice(data);
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
      name: 'RoomPrice',
      plural: 'RoomPrices',
      path: 'RoomPrices',
      idName: 'id',
      properties: {
        "price": {
          name: 'price',
          type: 'number'
        },
        "startDate": {
          name: 'startDate',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "hotelId": {
          name: 'hotelId',
          type: 'any'
        },
        "roomId": {
          name: 'roomId',
          type: 'any'
        },
      },
      relations: {
        hotel: {
          name: 'hotel',
          type: 'Hotel',
          model: 'Hotel',
          relationType: 'belongsTo',
                  keyFrom: 'hotelId',
          keyTo: 'id'
        },
        room: {
          name: 'room',
          type: 'Room',
          model: 'Room',
          relationType: 'belongsTo',
                  keyFrom: 'roomId',
          keyTo: 'id'
        },
      }
    }
  }
}
