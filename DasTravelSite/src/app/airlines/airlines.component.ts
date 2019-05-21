import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {LoopBackConfig, Airline, Flight, Seat, SeatReservation, QuickFlightReservation} from '../shared/sdk';
import {AirlineApi, SeatApi, SeatReservationApi, QuickFlightReservationApi} from '../shared/sdk/services';
import {API_VERSION} from '../shared/baseUrl';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTable} from '@angular/material';
import {LoginServiceService} from '../login-service.service';

@Component({
  selector: 'app-airlines',
  templateUrl: './airlines.component.html',
  styleUrls: ['./airlines.component.scss']
})
export class AirlinesComponent implements OnInit {

  userType: string;
  userId: string;

  discountsActive = false;

  viewInitialized = false;

  /****** AIRLINE DATA ******/

  selectedAirline: Airline = null;
  setClickedRow : Function;
  airlineList: Airline[] = null;

  displayedColumns: string[] = ['name', 'address'];

  @ViewChild('airlineTableDir') airlineTable: MatTable<any>;

  /****** DISCOUNT DATA ******/

  selectedDiscount: any = null;
  setClickedRowD : Function;
  discountList: any[] = null;

  displayedColumnsD: string[] = ['origin', 'destination', 'takeoffDate', 'landingDate', 'classType', 'seat', 'price', 'discount'];

  @ViewChild('discountTableDir') discountTable: MatTable<any>;

  classTypes = {
    'e': 'Economy class',
    'b': 'Business class',
    'f': 'First class'
  };

  /****** BASIC FUNCTIONS ******/

  constructor(@Inject('baseURL') private baseURL,
  private airlineService: AirlineApi,
  private seatService: SeatApi,
  private seatReservationService: SeatReservationApi,
  private quickFlightReservationService: QuickFlightReservationApi,
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
      this.selectedAirline = index;
    }
    this.setClickedRowD = function(index){
      this.selectedDiscount = index;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    if (this.discountsActive)
      this.refreshDiscounts();
    else
      this.refreshAirlines();
    console.log(this.airlineTable + "\n" + this.discountTable);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  refreshAirlines() {
    this.airlineService.find().subscribe(
      result => {
        this.airlineList = result as Airline[];
        console.log("found airlines > " + JSON.stringify(result));
        /*if (this.viewInitialized)
          this.airlineTable.renderRows();*/
      }
      , err => {
        console.log(err);
      }
    );
  }

  refreshDiscounts() {
    this.quickFlightReservationService.find().subscribe(
      result => {
        this.discountList = [];
        let quickResList: QuickFlightReservation[] = result as QuickFlightReservation[];
        for (const quickRes of quickResList) {
          this.seatReservationService.findById(quickRes.seatReservationId).subscribe(
            result => {
              let seatReservation: SeatReservation = result as SeatReservation;
              this.seatService.findById(seatReservation.seatId, {'include': 'flight'}).subscribe(
                result => {
                  let seat: Seat = result as Seat;
                  console.log("Found a seat > " + JSON.stringify(seat));
                  if (seat.flight.airlineId == this.selectedAirline.id) {
                    let discount: any = {
                      origin: seat.flight.origin,
                      destination: seat.flight.destination,
                      takeoffDate: seat.flight.takeoffDate,
                      landingDate: seat.flight.landingDate,
                      classType: seat.classType,
                      seat: seat.row + '-' + seat.column,
                      discount: quickRes.discount
                    };
                    discount.price = (seat.classType == 'e') ? seat.flight.price * 1.0 : 
                                     ((seat.classType == 'b') ? seat.flight.price * 1.2 : 
                                     seat.flight.price * 1.5);
                    discount.quickRes = quickRes;
                    discount.seatReservation = seatReservation;

                    console.log("Discount to be added > " + JSON.stringify(discount));
                    this.discountList.push(discount);
                    /*if (this.viewInitialized)
                      this.discountTable.renderRows();*/
                  }
                },
                err => {
                  console.log(err);
                }
              );
            },
            err => {
              console.log(err);
            }
          );
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  /****** BUTTON PRESSES ******/

  checkDiscountsButton() {
    if (this.selectedAirline != null) {
      this.discountsActive = true;
      this.refreshDiscounts();
    }
  }

  reserveButton() {
    if (this.selectedDiscount != null) {
      this.seatReservationService.updateAttributes(this.selectedDiscount.seatReservation.id, 
        {myuserId: this.userId, 
        seatId: this.selectedDiscount.seatReservation.seatId,
        price: this.selectedDiscount.seatReservation.price}).subscribe(
        result => {
          this.openSnackBar("Reservation successfuly made", "Dismiss");
          console.log(result);
          this.quickFlightReservationService.deleteById(this.selectedDiscount.quickRes.id).subscribe(
            result => {
              console.log(result);
              this.refreshDiscounts();
            },
            err => {
              this.openSnackBar("Error during database connection", "Dismiss");
              console.log(err);
            }
          );
        },
        err => {
          this.openSnackBar("Failed to reserve seat", "Dismiss");
          console.log(err);
        }
      );
    }
  }

  cancelReserveButton() {
    this.selectedDiscount = null;
    this.discountList = null;

    this.discountsActive = false;
    this.refreshAirlines();
  }

}
