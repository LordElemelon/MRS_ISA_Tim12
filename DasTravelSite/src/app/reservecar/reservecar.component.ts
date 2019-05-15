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

  constructor(@Inject('baseURL') private baseURL,
  private itemService: ItemService,
     private loginService: LoginServiceService,
     private reservationService: CarReservationApi,
     private carService: CarApi,
     private snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.car = this.itemService.getReservableCar();
    var temp = this.itemService.getReservableCar();
    if (temp) {
      this.car = temp;
    } else {
      this.car =  {
        'registration' : "",
        'start': 0,
        'end': 0,
        'days': 0,
        'seats': 0,
        'category': ''
      }
    }
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(this.car.start);
    var secondDate = new Date(this.car.end);
    this.car.days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    loginService.user
    .subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        this.userId = data.user.id
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
    //this.carservice.findOne({where: {"registration": this.car.registration}});
    this.car.registration = this.car.registration.trim();
    this.carService.findOne({where: {"registration": this.car.registration}})
    .subscribe(
      (result) => {
        var car_result = result as Car;
        var startDate = new Date(this.car.start).toJSON();
        var endDate = new Date(this.car.end).toJSON();
        this.reservationService.makeReservation(startDate, endDate, car_result.id, this.userId, this.car.price, car_result.rentalServiceId)
        .subscribe(
          (result) => {
            this.openSnackBar("Reservation successfuly made", "Dismiss");
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
