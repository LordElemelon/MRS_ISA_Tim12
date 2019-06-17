/* tslint:disable */

declare var Object: any;
export interface AdminCompanyInterface {
  "adminid": string;
  "companyid": string;
  "id"?: any;
}

export class AdminCompany implements AdminCompanyInterface {
  "adminid": string;
  "companyid": string;
  "id": any;
  constructor(data?: AdminCompanyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AdminCompany`.
   */
  public static getModelName() {
    return "AdminCompany";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AdminCompany for dynamic purposes.
  **/
  public static factory(data: AdminCompanyInterface): AdminCompany{
    return new AdminCompany(data);
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
      name: 'AdminCompany',
      plural: 'AdminCompanies',
      path: 'AdminCompanies',
      idName: 'id',
      properties: {
        "adminid": {
          name: 'adminid',
          type: 'string'
        },
        "companyid": {
          name: 'companyid',
          type: 'string'
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
