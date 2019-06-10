/* tslint:disable */
import {
  Room,
  RoomPrice,
  HotelSpecialOffer,
  HotelDiscount,
  Location
} from '../index';

declare var Object: any;
export interface HotelInterface {
  "name": string;
  "address": string;
  "latitude"?: number;
  "longitude"?: number;
  "description"?: string;
  "ratingCount"?: number;
  "rating"?: number;
  "id"?: any;
  "myuserId"?: any;
  "locationId"?: any;
  rooms?: Room[];
  roomPrices?: RoomPrice[];
  hotelSpecialOffers?: HotelSpecialOffer[];
  hotelDiscounts?: HotelDiscount[];
  location?: Location;
}

export class Hotel implements HotelInterface {
  "name": string;
  "address": string;
  "latitude": number;
  "longitude": number;
  "description": string;
  "ratingCount": number;
  "rating": number;
  "id": any;
  "myuserId": any;
  "locationId": any;
  rooms: Room[];
  roomPrices: RoomPrice[];
  hotelSpecialOffers: HotelSpecialOffer[];
  hotelDiscounts: HotelDiscount[];
  location: Location;
  constructor(data?: HotelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Hotel`.
   */
  public static getModelName() {
    return "Hotel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Hotel for dynamic purposes.
  **/
  public static factory(data: HotelInterface): Hotel{
    return new Hotel(data);
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
      name: 'Hotel',
      plural: 'Hotels',
      path: 'Hotels',
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
        "latitude": {
          name: 'latitude',
          type: 'number'
        },
        "longitude": {
          name: 'longitude',
          type: 'number'
        },
        "description": {
          name: 'description',
          type: 'string'
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
        "myuserId": {
          name: 'myuserId',
          type: 'any'
        },
        "locationId": {
          name: 'locationId',
          type: 'any'
        },
      },
      relations: {
        rooms: {
          name: 'rooms',
          type: 'Room[]',
          model: 'Room',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'hotelId'
        },
        roomPrices: {
          name: 'roomPrices',
          type: 'RoomPrice[]',
          model: 'RoomPrice',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'hotelId'
        },
        hotelSpecialOffers: {
          name: 'hotelSpecialOffers',
          type: 'HotelSpecialOffer[]',
          model: 'HotelSpecialOffer',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'hotelId'
        },
        hotelDiscounts: {
          name: 'hotelDiscounts',
          type: 'HotelDiscount[]',
          model: 'HotelDiscount',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'hotelId'
        },
        location: {
          name: 'location',
          type: 'Location',
          model: 'Location',
          relationType: 'belongsTo',
                  keyFrom: 'locationId',
          keyTo: 'id'
        },
      }
    }
  }
}
