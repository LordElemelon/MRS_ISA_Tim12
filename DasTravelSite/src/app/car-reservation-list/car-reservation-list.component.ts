import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Car, CarReservation, RentalService, Room} from '../shared/sdk/models';
import {MatSnackBar, MatTable} from '@angular/material';
import {CarApi, MyuserApi, RentalServiceApi} from '../shared/sdk/services/custom';

@Component({
  selector: 'app-car-reservation-list',
  templateUrl: './car-reservation-list.component.html',
  styleUrls: ['./car-reservation-list.component.scss']
})
export class CarReservationListComponent implements OnInit {
  carReservations: CarReservation[];
  reservationsInfo = [];

  columnsToDisplayReservations = [];

  @ViewChild('tablereservations') tableReservations: MatTable<any>;

  constructor(@Inject('baseURL') private baseURL,
              private myuserservice: MyuserApi,
              private carservice: CarApi,
              private rentalserviceservice: RentalServiceApi,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit() {
    if (this.myuserservice.getCachedCurrent()) {
      this.myuserservice.getRoomReservations(this.myuserservice.getCachedCurrent())
        .subscribe(result => {
          this.carReservations = result.retval;
          const done = new Promise((resolve, reject) => {
            let index = 0;
            for (const carReservation of this.carReservations) {
              const idLen = carReservation.carsId.length;
              this.carservice.findById(carReservation.carsId.substring(1, idLen))
                .subscribe((car: Car) => {
                  this.rentalserviceservice.findById(car.rentalServiceId)
                    .subscribe((rentalService: RentalService) => {
                      this.reservationsInfo.push({reservation: carReservation, rentalService: rentalService});
                      index++;
                      if (index === this.carReservations.length) {
                        resolve();
                      }
                    }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
                }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));

            }
          });
          done.then(() => {
            console.log('done');
            this.tableReservations.renderRows();
          });
        }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));

    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
