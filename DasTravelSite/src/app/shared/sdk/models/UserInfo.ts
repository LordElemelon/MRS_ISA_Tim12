/* tslint:disable */
import {
  Myuser
} from '../index';

declare var Object: any;
export interface UserInfoInterface {
  "firstName"?: string;
  "lastName"?: string;
  "dateOfBirth"?: Date;
  "phoneNumber"?: string;
  "gender"?: string;
  "aboutMe"?: string;
  "id"?: any;
  "userIdId"?: any;
  userId?: Myuser;
}

export class UserInfo implements UserInfoInterface {
  "firstName": string;
  "lastName": string;
  "dateOfBirth": Date;
  "phoneNumber": string;
  "gender": string;
  "aboutMe": string;
  "id": any;
  "userIdId": any;
  userId: Myuser;
  constructor(data?: UserInfoInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `UserInfo`.
   */
  public static getModelName() {
    return "UserInfo";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of UserInfo for dynamic purposes.
  **/
  public static factory(data: UserInfoInterface): UserInfo{
    return new UserInfo(data);
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
      name: 'UserInfo',
      plural: 'UserInfos',
      path: 'UserInfos',
      idName: 'id',
      properties: {
        "firstName": {
          name: 'firstName',
          type: 'string'
        },
        "lastName": {
          name: 'lastName',
          type: 'string'
        },
        "dateOfBirth": {
          name: 'dateOfBirth',
          type: 'Date'
        },
        "phoneNumber": {
          name: 'phoneNumber',
          type: 'string'
        },
        "gender": {
          name: 'gender',
          type: 'string'
        },
        "aboutMe": {
          name: 'aboutMe',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "userIdId": {
          name: 'userIdId',
          type: 'any'
        },
      },
      relations: {
        userId: {
          name: 'userId',
          type: 'Myuser',
          model: 'Myuser',
          relationType: 'belongsTo',
                  keyFrom: 'userIdId',
          keyTo: 'id'
        },
      }
    }
  }
}
