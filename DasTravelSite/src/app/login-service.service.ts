import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Myuser} from './shared/sdk/models';
import {RentalService} from './shared/sdk/models';
import { RentalServiceApi } from './shared/sdk';
import { ItemService } from './services/item.service';


@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  observableUser = new BehaviorSubject<any>(null);
  public user: Observable<any>;
  constructor(private rentalServiceService: RentalServiceApi,
    private itemService: ItemService) {
    this.user = this.observableUser.asObservable();
    this.user.subscribe((result) => {
      if (result == null) return;
      if (result.user.type === "rentalServiceAdmin") {
        this.rentalServiceService.findOne({where: {myuserId: result.user.id}})
        .subscribe(
          (result)=> {
            this.itemService.setServiceId((result as RentalService).id);
          },
          (err) => {
            console.log(err);
          })
      }
    })
  }
}
