/* tslint:disable */
import {
  Room
} from '../index';

declare var Object: any;
export interface RoomidInterface {
  "id"?: number;
  "roomId"?: any;
  room?: Room;
}

export class Roomid implements RoomidInterface {
  "id": number;
  "roomId": any;
  room: Room;
  constructor(data?: RoomidInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Roomid`.
   */
  public static getModelName() {
    return "Roomid";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Roomid for dynamic purposes.
  **/
  public static factory(data: RoomidInterface): Roomid{
    return new Roomid(data);
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
      name: 'Roomid',
      plural: 'Roomids',
      path: 'Roomids',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
        "roomId": {
          name: 'roomId',
          type: 'any'
        },
      },
      relations: {
        room: {
          name: 'room',
          type: 'Room',
          model: 'Room',
          relationType: 'belongsTo',
                  keyFrom: 'roomId',
          keyTo: 'id'
        },
      }
    }
  }
}
