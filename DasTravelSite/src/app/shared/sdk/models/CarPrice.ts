/* tslint:disable */
import {
  RentalService
} from '../index';

declare var Object: any;
export interface CarPriceInterface {
  "start"?: Date;
  "catAPrice": number;
  "catBPrice": number;
  "catCPrice": number;
  "id"?: any;
  "rentalServiceId"?: any;
  rentalService?: RentalService;
}

export class CarPrice implements CarPriceInterface {
  "start": Date;
  "catAPrice": number;
  "catBPrice": number;
  "catCPrice": number;
  "id": any;
  "rentalServiceId": any;
  rentalService: RentalService;
  constructor(data?: CarPriceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `CarPrice`.
   */
  public static getModelName() {
    return "CarPrice";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of CarPrice for dynamic purposes.
  **/
  public static factory(data: CarPriceInterface): CarPrice{
    return new CarPrice(data);
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
      name: 'CarPrice',
      plural: 'CarPrices',
      path: 'CarPrices',
      idName: 'id',
      properties: {
        "start": {
          name: 'start',
          type: 'Date'
        },
        "catAPrice": {
          name: 'catAPrice',
          type: 'number'
        },
        "catBPrice": {
          name: 'catBPrice',
          type: 'number'
        },
        "catCPrice": {
          name: 'catCPrice',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "rentalServiceId": {
          name: 'rentalServiceId',
          type: 'any'
        },
      },
      relations: {
        rentalService: {
          name: 'rentalService',
          type: 'RentalService',
          model: 'RentalService',
          relationType: 'belongsTo',
                  keyFrom: 'rentalServiceId',
          keyTo: 'id'
        },
      }
    }
  }
}
