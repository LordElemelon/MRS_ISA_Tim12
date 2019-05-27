/* tslint:disable */
import {
  Hotel,
  RoomPrice,
  HotelDiscount
} from '../index';

declare var Object: any;
export interface RoomInterface {
  "number": number;
  "description": string;
  "beds": number;
  "active": boolean;
  "ratingCount"?: number;
  "rating"?: number;
  "id"?: any;
  "hotelId"?: any;
  hotel?: Hotel;
  roomPrices?: RoomPrice[];
  hotelDiscounts?: HotelDiscount[];
}

export class Room implements RoomInterface {
  "number": number;
  "description": string;
  "beds": number;
  "active": boolean;
  "ratingCount": number;
  "rating": number;
  "id": any;
  "hotelId": any;
  hotel: Hotel;
  roomPrices: RoomPrice[];
  hotelDiscounts: HotelDiscount[];
  constructor(data?: RoomInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Room`.
   */
  public static getModelName() {
    return "Room";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Room for dynamic purposes.
  **/
  public static factory(data: RoomInterface): Room{
    return new Room(data);
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
      name: 'Room',
      plural: 'Rooms',
      path: 'Rooms',
      idName: 'id',
      properties: {
        "number": {
          name: 'number',
          type: 'number'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "beds": {
          name: 'beds',
          type: 'number',
          default: 1
        },
        "active": {
          name: 'active',
          type: 'boolean',
          default: true
        },
        "ratingCount": {
          name: 'ratingCount',
          type: 'number',
          default: 0
        },
        "rating": {
          name: 'rating',
          type: 'number',
          default: 0
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "hotelId": {
          name: 'hotelId',
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
        roomPrices: {
          name: 'roomPrices',
          type: 'RoomPrice[]',
          model: 'RoomPrice',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'roomId'
        },
        hotelDiscounts: {
          name: 'hotelDiscounts',
          type: 'HotelDiscount[]',
          model: 'HotelDiscount',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'roomId'
        },
      }
    }
  }
}
