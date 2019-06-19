import { Component, OnInit, Inject } from '@angular/core';
import { CarSpecialOfferApi, LoopBackConfig, CarSpecialOffer, CarApi } from '../shared/sdk';
import { baseURL, API_VERSION } from '../shared/baseUrl';
import { MatSnackBar } from '@angular/material';
import { ItemService } from '../services/item.service';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-list-car-discounts',
  templateUrl: './list-car-discounts.component.html',
  styleUrls: ['./list-car-discounts.component.scss']
})
export class ListCarDiscountsComponent implements OnInit {


  foundDiscounts;

  constructor(@Inject('baseURL') private baseURL,
  private carDiscountService: CarSpecialOfferApi,
  public snackBar: MatSnackBar,
  private carService: CarApi,
  private itemService:ItemService,
  private _router: Router) { 
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.carDiscountService.find({})
    .subscribe(
      (result) => {
        this.foundDiscounts = [];
        var i = 0;
        var rentalid = this.itemService.getServiceId();
        for (let mini_result of result) {
          var temp = mini_result as any;
          if (rentalid == temp.rentalServiceId) {
            temp.nmbr = i;
            i++;
            console.log(mini_result);
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            temp.startDate = new Date(temp.startDate);
            temp.endDate = new Date(temp.endDate);
            temp.days = 1 + Math.round(Math.abs((temp.startDate.getTime() - temp.endDate.getTime())/(oneDay)));
            temp.startDate = temp.startDate.toLocaleDateString("en-US");
            temp.endDate = temp.endDate.toLocaleDateString("en-US");
            temp.total = temp.basePrice;
            temp.totalDiscounted = Math.round((100 - temp.discount) / 100 * temp.total);
            if (temp.myuserId == null) {
              temp.status = 'Not reserved';
            } else {
              temp.status = 'Reserved';
            }
            this.foundDiscounts.push(temp);
          }
          
        }
      },
      (err) => {
        this.openSnackBar("Could not retrieve discounts", "Dismiss");
      }
    )
    
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  inspect(clicked_card: any) {
    var discount_index = clicked_card.path[0].id;
    this.itemService.setCarSpecialOffer(this.foundDiscounts[discount_index]);
    this._router.navigate(['/reserveCarSpecial']);

  }

}
