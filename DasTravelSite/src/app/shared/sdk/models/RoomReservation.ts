/* tslint:disable */
import {
  Room,
  Myuser
} from '../index';

declare var Object: any;
export interface RoomReservationInterface {
  "startDate": Date;
  "endDate": Date;
  "price": number;
  "id"?: number;
  "roomId"?: any;
  "myuserId"?: any;
  room?: Room;
  myuser?: Myuser;
}

export class RoomReservation implements RoomReservationInterface {
  "startDate": Date;
  "endDate": Date;
  "price": number;
  "id": number;
  "roomId": any;
  "myuserId": any;
  room: Room;
  myuser: Myuser;
  constructor(data?: RoomReservationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RoomReservation`.
   */
  public static getModelName() {
    return "RoomReservation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RoomReservation for dynamic purposes.
  **/
  public static factory(data: RoomReservationInterface): RoomReservation{
    return new RoomReservation(data);
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
      name: 'RoomReservation',
      plural: 'RoomReservations',
      path: 'RoomReservations',
      idName: 'id',
      properties: {
        "startDate": {
          name: 'startDate',
          type: 'Date'
        },
        "endDate": {
          name: 'endDate',
          type: 'Date'
        },
        "price": {
          name: 'price',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "roomId": {
          name: 'roomId',
          type: 'any'
        },
        "myuserId": {
          name: 'myuserId',
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
        myuser: {
          name: 'myuser',
          type: 'Myuser',
          model: 'Myuser',
          relationType: 'belongsTo',
                  keyFrom: 'myuserId',
          keyTo: 'id'
        },
      }
    }
  }
}
