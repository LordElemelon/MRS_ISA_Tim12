import { Component, OnInit, Inject } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Car, LoopBackConfig } from '../shared/sdk';
import { LoginServiceService } from '../login-service.service';
import { CarReservationApi, CarApi } from '../shared/sdk/services';
import { MatSnackBar } from '@angular/material';
import { API_VERSION } from '../shared/baseUrl';


@Component({
  selector: 'app-reservecar',
  templateUrl: './reservecar.component.html',
  styleUrls: ['./reservecar.component.scss']
})
export class ReservecarComponent implements OnInit {



  car;
  canReserve = false;
  userType;
  userId;
  canUseBonusPointsCar = false;

  constructor(@Inject('baseURL') private baseURL,
  private itemService: ItemService,
     private loginService: LoginServiceService,
     private reservationService: CarReservationApi,
     private carService: CarApi,
     private snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    //this.car = this.itemService.getReservableCar();
    var temp = this.itemService.getReservableCar();
    if (temp) {
      this.car = temp;
      this.car.usingBonus = false;
    } else {
      this.car =  {
        'registration' : "",
        'start': 0,
        'end': 0,
        'days': 0,
        'seats': 0,
        'category': '',
        'usingBonus': false
      }
    }
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(this.car.start);
    var secondDate = new Date(this.car.end);
    this.car.days = 1 + Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    this.car.totalPrice = this.car.days * this.car.price
    this.car.showPrice = this.car.totalPrice;
    loginService.user
    .subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        this.userId = data.user.id
        if (this.userType == "registeredUser") {
          this.canReserve = true;
          if (this.itemService.getHeader().getBonusPoints() >= 100) {
            this.canUseBonusPointsCar = true;
          }
        }
      }
    });
   }


   carCheckboxClicked() {
     if (this.car.usingBonus) {
        this.car.showPrice = this.car.totalPrice - Math.round(this.car.totalPrice * 0.1)
     } else {
        this.car.showPrice = this.car.totalPrice;
     }
   }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSubmit() {
    this.car.registration = this.car.registration.trim();
    this.carService.findOne({where: {"registration": this.car.registration}})
    .subscribe(
      (result) => {
        var car_result = result as Car;
        var startDate = new Date(this.car.start).toJSON();
        var endDate = new Date(this.car.end).toJSON();
        console.log(this.car.usingBonus)
        var temp_price = this.car.totalPrice;
        if (this.car.usingBonus)  {
          temp_price = Math.round(this.car.totalPrice * 0.9);
        }
        
        this.reservationService.makeReservation(startDate, endDate, car_result.id, this.userId, temp_price, car_result.rentalServiceId, this.car.usingBonus)
        .subscribe(
          (result) => {
            this.openSnackBar("Reservation successfuly made", "Dismiss");
            if (this.car.usingBonus) {
              this.itemService.getHeader().removeBonusPoints();
            }
          },
          (err) => {
            this.openSnackBar("Failed to make reservation", "Dismiss");
          }
        )
      },
      (err) => {
        this.openSnackBar("Car does not exist", "Dismiss");
      }
    )
  }
}
