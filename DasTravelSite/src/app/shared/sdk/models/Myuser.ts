/* tslint:disable */
import {
  Hotel,
  Airline,
  RentalService
} from '../index';

declare var Object: any;
export interface MyuserInterface {
  "type": string;
  "bonusPoints"?: number;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: any;
  "password"?: string;
  accessTokens?: any[];
  hotel?: Hotel;
  airline?: Airline;
  rentalService?: RentalService;
}

export class Myuser implements MyuserInterface {
  "type": string;
  "bonusPoints": number;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "password": string;
  accessTokens: any[];
  hotel: Hotel;
  airline: Airline;
  rentalService: RentalService;
  constructor(data?: MyuserInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Myuser`.
   */
  public static getModelName() {
    return "Myuser";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Myuser for dynamic purposes.
  **/
  public static factory(data: MyuserInterface): Myuser{
    return new Myuser(data);
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
      name: 'Myuser',
      plural: 'Myusers',
      path: 'Myusers',
      idName: 'id',
      properties: {
        "type": {
          name: 'type',
          type: 'string',
          default: 'registeredUser'
        },
        "bonusPoints": {
          name: 'bonusPoints',
          type: 'number',
          default: 0
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        hotel: {
          name: 'hotel',
          type: 'Hotel',
          model: 'Hotel',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'myuserId'
        },
        airline: {
          name: 'airline',
          type: 'Airline',
          model: 'Airline',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'myuserId'
        },
        rentalService: {
          name: 'rentalService',
          type: 'RentalService',
          model: 'RentalService',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'myuserId'
        },
      }
    }
  }
}
