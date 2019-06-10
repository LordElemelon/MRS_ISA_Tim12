/* tslint:disable */
import {
  RentalService
} from '../index';

declare var Object: any;
export interface BranchInterface {
  "name": string;
  "address": string;
  "latitude"?: number;
  "longitude"?: number;
  "id"?: any;
  "rentalServiceId"?: any;
  rentalService?: RentalService;
}

export class Branch implements BranchInterface {
  "name": string;
  "address": string;
  "latitude": number;
  "longitude": number;
  "id": any;
  "rentalServiceId": any;
  rentalService: RentalService;
  constructor(data?: BranchInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Branch`.
   */
  public static getModelName() {
    return "Branch";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Branch for dynamic purposes.
  **/
  public static factory(data: BranchInterface): Branch{
    return new Branch(data);
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
      name: 'Branch',
      plural: 'Branches',
      path: 'Branches',
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
