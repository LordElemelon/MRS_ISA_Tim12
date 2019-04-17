/* tslint:disable */
import {
  Hotel,
  Room,
  DiscountOffer
} from '../index';

declare var Object: any;
export interface HotelDiscountInterface {
  "discount": number;
  "startDate": Date;
  "endDate": Date;
  "id"?: any;
  "hotelId"?: any;
  "roomId"?: any;
  hotel?: Hotel;
  room?: Room;
  discountOffers?: DiscountOffer[];
}

export class HotelDiscount implements HotelDiscountInterface {
  "discount": number;
  "startDate": Date;
  "endDate": Date;
  "id": any;
  "hotelId": any;
  "roomId": any;
  hotel: Hotel;
  room: Room;
  discountOffers: DiscountOffer[];
  constructor(data?: HotelDiscountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `HotelDiscount`.
   */
  public static getModelName() {
    return "HotelDiscount";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of HotelDiscount for dynamic purposes.
  **/
  public static factory(data: HotelDiscountInterface): HotelDiscount{
    return new HotelDiscount(data);
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
      name: 'HotelDiscount',
      plural: 'HotelDiscounts',
      path: 'HotelDiscounts',
      idName: 'id',
      properties: {
        "discount": {
          name: 'discount',
          type: 'number'
        },
        "startDate": {
          name: 'startDate',
          type: 'Date'
        },
        "endDate": {
          name: 'endDate',
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
        discountOffers: {
          name: 'discountOffers',
          type: 'DiscountOffer[]',
          model: 'DiscountOffer',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'hotelDiscountId'
        },
      }
    }
  }
}
