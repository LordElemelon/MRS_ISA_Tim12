/* tslint:disable */
import {
  Airline,
  Seat
} from '../index';

declare var Object: any;
export interface FlightInterface {
  "origin": string;
  "destination": string;
  "takeoffDate": Date;
  "landingDate": Date;
  "duration"?: number;
  "length"?: number;
  "layover"?: string;
  "price": number;
  "id"?: any;
  "airlineId"?: any;
  airline?: Airline;
  seats?: Seat[];
}

export class Flight implements FlightInterface {
  "origin": string;
  "destination": string;
  "takeoffDate": Date;
  "landingDate": Date;
  "duration": number;
  "length": number;
  "layover": string;
  "price": number;
  "id": any;
  "airlineId": any;
  airline: Airline;
  seats: Seat[];
  constructor(data?: FlightInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Flight`.
   */
  public static getModelName() {
    return "Flight";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Flight for dynamic purposes.
  **/
  public static factory(data: FlightInterface): Flight{
    return new Flight(data);
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
      name: 'Flight',
      plural: 'Flights',
      path: 'Flights',
      idName: 'id',
      properties: {
        "origin": {
          name: 'origin',
          type: 'string'
        },
        "destination": {
          name: 'destination',
          type: 'string'
        },
        "takeoffDate": {
          name: 'takeoffDate',
          type: 'Date'
        },
        "landingDate": {
          name: 'landingDate',
          type: 'Date'
        },
        "duration": {
          name: 'duration',
          type: 'number'
        },
        "length": {
          name: 'length',
          type: 'number'
        },
        "layover": {
          name: 'layover',
          type: 'string'
        },
        "price": {
          name: 'price',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "airlineId": {
          name: 'airlineId',
          type: 'any'
        },
      },
      relations: {
        airline: {
          name: 'airline',
          type: 'Airline',
          model: 'Airline',
          relationType: 'belongsTo',
                  keyFrom: 'airlineId',
          keyTo: 'id'
        },
        seats: {
          name: 'seats',
          type: 'Seat[]',
          model: 'Seat',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'flightId'
        },
      }
    }
  }
}
