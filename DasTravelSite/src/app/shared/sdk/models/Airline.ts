/* tslint:disable */
import {
  Flight
} from '../index';

declare var Object: any;
export interface AirlineInterface {
  "name": string;
  "address"?: string;
  "description"?: string;
  "destinations"?: string;
  "id"?: any;
  "myuserId"?: any;
  flights?: Flight[];
}

export class Airline implements AirlineInterface {
  "name": string;
  "address": string;
  "description": string;
  "destinations": string;
  "id": any;
  "myuserId": any;
  flights: Flight[];
  constructor(data?: AirlineInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Airline`.
   */
  public static getModelName() {
    return "Airline";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Airline for dynamic purposes.
  **/
  public static factory(data: AirlineInterface): Airline{
    return new Airline(data);
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
      name: 'Airline',
      plural: 'Airlines',
      path: 'Airlines',
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
        "destinations": {
          name: 'destinations',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "myuserId": {
          name: 'myuserId',
          type: 'any'
        },
      },
      relations: {
        flights: {
          name: 'flights',
          type: 'Flight[]',
          model: 'Flight',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'airlineId'
        },
      }
    }
  }
}
