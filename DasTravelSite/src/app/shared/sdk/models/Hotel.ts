/* tslint:disable */
import {
  Room
} from '../index';

declare var Object: any;
export interface HotelInterface {
  "name": string;
  "address": string;
  "description"?: string;
  "id"?: any;
  rooms?: Room[];
}

export class Hotel implements HotelInterface {
  "name": string;
  "address": string;
  "description": string;
  "id": any;
  rooms: Room[];
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
        "description": {
          name: 'description',
          type: 'string'
        },
        "id": {
          name: 'id',
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
      }
    }
  }
}
