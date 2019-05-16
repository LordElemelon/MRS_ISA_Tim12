import { Component, Input, OnInit, Inject, ViewChild } from '@angular/core';
import {LoopBackConfig, Flight, FlightApi, Seat, SeatApi, SeatId, SeatIdApi, SeatReservation, SeatReservationApi} from '../shared/sdk';
import {API_VERSION} from '../shared/baseUrl';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTable} from '@angular/material';
import {LoginServiceService} from '../login-service.service';

@Component({
  selector: 'app-reserve-seat',
  templateUrl: './reserve-seat.component.html',
  styleUrls: ['./reserve-seat.component.scss']
})
export class ReserveSeatComponent implements OnInit {
  @Input() selectedFlight: Flight;

  userType: string;
  userId: string;

  setClickedRow : Function;
  selectedSeat: Seat = null;
  seatList: Seat[] = null;
  seatPrices = {};

  classTypes = {
    'e': 'Economy class',
    'b': 'Business class',
    'f': 'First class'
  };

  displayedColumns: string[] = ['row', 'column', 'classType', 'price'];

  @ViewChild('seatTable') seatTable: MatTable<any>;

  constructor(@Inject('baseURL') private baseURL,
              private flightservice: FlightApi,
              private seatservice: SeatApi,
              private seatidservice: SeatIdApi,
              private seatreservationservice: SeatReservationApi,
              private fb: FormBuilder,
              private loginService: LoginServiceService,
              public snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        this.userId = data.user.id;
      }
    });
    this.setClickedRow = function(index){
      this.selectedSeat = index;
    }
  }

  ngOnInit() {
    this.refreshSeats();
  }

  refreshSeats() {
    this.flightservice.findAvailableSeats(this.selectedFlight.id)
    .subscribe(result => {
      this.seatPrices = {};
      for (const seat of result.retval) {
        this.seatPrices[seat.id] = (seat.classType == 'e') ? this.selectedFlight.price : 
          ((seat.classType == 'f') ? this.selectedFlight.price * 1.5 : this.selectedFlight.price * 1.2);
        this.seatPrices[seat.id] = Math.round(this.seatPrices[seat.id]);
      }
      this.seatList = result.retval;
      console.log(result.retval);
    }, err => {
      console.log(err);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  reserveButton() {
    if (this.selectedSeat != null) {
      console.log(this.userId);
      this.seatreservationservice.makeReservation(this.selectedSeat.id, this.userId, this.seatPrices[this.selectedSeat.id])
      .subscribe(
        (result) => {
          this.openSnackBar("Reservation successfuly made", "Dismiss");
          this.refreshSeats();
        },
        (err) => {
          this.openSnackBar("Failed to make reservation", "Dismiss");
        }
      );
    }
  }

}
