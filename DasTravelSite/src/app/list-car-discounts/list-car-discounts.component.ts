import { Component, OnInit, Inject } from '@angular/core';
import { CarSpecialOfferApi, LoopBackConfig, CarSpecialOffer, CarApi } from '../shared/sdk';
import { baseURL, API_VERSION } from '../shared/baseUrl';
import { MatSnackBar } from '@angular/material';
import { ItemService } from '../services/item.service';
import { Router } from '@angular/router';

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
        var i = 0;
        for (let mini_result of result) {
          var temp = mini_result as any;
          temp.nmbr = i;
          i++;
          temp.startDate = new Date(temp.startDate).toLocaleDateString("en-US");
          temp.endDate = new Date(temp.endDate).toLocaleDateString("en-US");
        }
        this.foundDiscounts = result;
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
    var to_parse = clicked_card.target.innerText;
    var parts = to_parse.split('\n');
    var index = parseInt(parts[0].split(':')[1]);
    this.itemService.setCarSpecialOffer(this.foundDiscounts[index]);
    this._router.navigate(['/reserveCarSpecial']);

  }

}
