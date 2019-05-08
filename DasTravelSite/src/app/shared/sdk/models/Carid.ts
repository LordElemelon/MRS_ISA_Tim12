/* tslint:disable */
import {
  Car
} from '../index';

declare var Object: any;
export interface CaridInterface {
  "id"?: number;
  "carId"?: any;
  car?: Car;
}

export class Carid implements CaridInterface {
  "id": number;
  "carId": any;
  car: Car;
  constructor(data?: CaridInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Carid`.
   */
  public static getModelName() {
    return "Carid";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Carid for dynamic purposes.
  **/
  public static factory(data: CaridInterface): Carid{
    return new Carid(data);
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
      name: 'Carid',
      plural: 'Carids',
      path: 'Carids',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "carId": {
          name: 'carId',
          type: 'any'
        },
      },
      relations: {
        car: {
          name: 'car',
          type: 'Car',
          model: 'Car',
          relationType: 'belongsTo',
                  keyFrom: 'carId',
          keyTo: 'id'
        },
      }
    }
  }
}
