import { Component, OnInit, Inject } from '@angular/core';
import { ItemService } from '../services/item.service';
import { LoginServiceService } from '../login-service.service';
import { MatSnackBar } from '@angular/material';
import { LoopBackConfig, CarSpecialOfferApi } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';

@Component({
  selector: 'app-reserve-car-special',
  templateUrl: './reserve-car-special.component.html',
  styleUrls: ['./reserve-car-special.component.scss']
})
export class ReserveCarSpecialComponent implements OnInit {


  specialOffer;
  canReserve = false;
  userType;
  userId;

  constructor(@Inject('baseURL') private baseURL,
    private itemService: ItemService,
     private loginService: LoginServiceService,
     private snackBar: MatSnackBar,
     private specialOfferService: CarSpecialOfferApi) { 
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      //this.specialOffer = this.itemService.getCarSpecialOffer();
      var temp = this.itemService.getCarSpecialOffer();
      if (temp) {
        this.specialOffer = temp;
      } else {
        this.specialOffer = {
          'nmbr': 0,
          'registration': '',
          'endDate': '',
          'startDate': '',
          'basePrice': 0,
          'discount': 0
        }
      }
      loginService.user
      .subscribe(data => {
        if (data) {
          this.userType = data.user.type;
          this.userId = data.user.id;
          if (this.userType == "registeredUser") {
            this.canReserve = true;
          }
        }
      });
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSubmit() {
    console.log("Hellou");
    console.log(this.specialOffer);
    this.specialOfferService.quicklyReserve(this.specialOffer.carsId, this.specialOffer.id, this.userId)
    .subscribe((result) => {
      this.openSnackBar("Successfully reserved special offer", "Dismiss");
    },
    (err) => {
      this.openSnackBar("Failed to make quick reservation", "Dismiss");
    })
  }

}
