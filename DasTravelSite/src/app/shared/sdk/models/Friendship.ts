/* tslint:disable */

declare var Object: any;
export interface FriendshipInterface {
  "firstUserId": string;
  "secondUserId": string;
  "accepted": boolean;
  "id"?: any;
}

export class Friendship implements FriendshipInterface {
  "firstUserId": string;
  "secondUserId": string;
  "accepted": boolean;
  "id": any;
  constructor(data?: FriendshipInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Friendship`.
   */
  public static getModelName() {
    return "Friendship";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Friendship for dynamic purposes.
  **/
  public static factory(data: FriendshipInterface): Friendship{
    return new Friendship(data);
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
      name: 'Friendship',
      plural: 'Friendships',
      path: 'Friendships',
      idName: 'id',
      properties: {
        "firstUserId": {
          name: 'firstUserId',
          type: 'string'
        },
        "secondUserId": {
          name: 'secondUserId',
          type: 'string'
        },
        "accepted": {
          name: 'accepted',
          type: 'boolean',
          default: false
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
