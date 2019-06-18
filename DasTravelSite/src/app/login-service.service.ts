import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Hotel, Myuser, AdminCompany} from './shared/sdk/models';
import {RentalService} from './shared/sdk/models';
import {HotelApi, RentalServiceApi, AdminCompanyApi} from './shared/sdk';
import { ItemService } from './services/item.service';



@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  observableUser = new BehaviorSubject<any>(null);
  public user: Observable<any>;
  constructor(private rentalServiceService: RentalServiceApi,
    private hotelservice: HotelApi,
    private itemService: ItemService,
    private adminCompanyService: AdminCompanyApi) {
    this.user = this.observableUser.asObservable();
    this.user.subscribe((result) => {
      if (result == null) return;
      if (result.user.type === "rentalServiceAdmin") {
        this.adminCompanyService.find()
        .subscribe(
          (result2) => {
            console.log(result2);
            for (let mini_result of result2) {
              var temp = mini_result as AdminCompany;
              if (temp.adminid == result.user.id) {
                this.itemService.setServiceId(temp.companyid);
                break;
              }
            }
          },
          (err) => {
            console.log(err);
          }
        )
      }
      if (result.user.type === "hotelAdmin") {
        this.hotelservice.findOne({where: {myuserId: result.user.id}})
          .subscribe((resultHotel: Hotel) => {
            this.itemService.setHotelId(resultHotel.id);
          }, (err) => console.log());
      }
    });
  }
}
