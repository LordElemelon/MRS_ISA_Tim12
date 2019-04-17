/* tslint:disable */
import {
  HotelDiscount,
  HotelSpecialOffer
} from '../index';

declare var Object: any;
export interface DiscountOfferInterface {
  "id"?: any;
  "hotelDiscountId"?: any;
  "hotelSpecialOfferId"?: any;
  hotelDiscount?: HotelDiscount;
  hotelSpecialOffer?: HotelSpecialOffer;
}

export class DiscountOffer implements DiscountOfferInterface {
  "id": any;
  "hotelDiscountId": any;
  "hotelSpecialOfferId": any;
  hotelDiscount: HotelDiscount;
  hotelSpecialOffer: HotelSpecialOffer;
  constructor(data?: DiscountOfferInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DiscountOffer`.
   */
  public static getModelName() {
    return "DiscountOffer";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DiscountOffer for dynamic purposes.
  **/
  public static factory(data: DiscountOfferInterface): DiscountOffer{
    return new DiscountOffer(data);
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
      name: 'DiscountOffer',
      plural: 'DiscountOffers',
      path: 'DiscountOffers',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "hotelDiscountId": {
          name: 'hotelDiscountId',
          type: 'any'
        },
        "hotelSpecialOfferId": {
          name: 'hotelSpecialOfferId',
          type: 'any'
        },
      },
      relations: {
        hotelDiscount: {
          name: 'hotelDiscount',
          type: 'HotelDiscount',
          model: 'HotelDiscount',
          relationType: 'belongsTo',
                  keyFrom: 'hotelDiscountId',
          keyTo: 'id'
        },
        hotelSpecialOffer: {
          name: 'hotelSpecialOffer',
          type: 'HotelSpecialOffer',
          model: 'HotelSpecialOffer',
          relationType: 'belongsTo',
                  keyFrom: 'hotelSpecialOfferId',
          keyTo: 'id'
        },
      }
    }
  }
}
