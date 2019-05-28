/* tslint:disable */
import {
  Hotel
} from '../index';

declare var Object: any;
export interface HotelSpecialOfferInterface {
  "name": string;
  "price": number;
  "id"?: any;
  "hotelId"?: any;
  hotel?: Hotel;
}

export class HotelSpecialOffer implements HotelSpecialOfferInterface {
  "name": string;
  "price": number;
  "id": any;
  "hotelId": any;
  hotel: Hotel;
  constructor(data?: HotelSpecialOfferInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `HotelSpecialOffer`.
   */
  public static getModelName() {
    return "HotelSpecialOffer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of HotelSpecialOffer for dynamic purposes.
  **/
  public static factory(data: HotelSpecialOfferInterface): HotelSpecialOffer{
    return new HotelSpecialOffer(data);
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
      name: 'HotelSpecialOffer',
      plural: 'HotelSpecialOffers',
      path: 'HotelSpecialOffers',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "price": {
          name: 'price',
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
      }
    }
  }
}
