import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {LoopBackConfig, Flight, FlightApi} from '../shared/sdk';
import {API_VERSION} from '../shared/baseUrl';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTable} from '@angular/material';
import {LoginServiceService} from '../login-service.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {

  onewayFlightList: Flight[];
  userType: string;

  onewaySearchForm: FormGroup;
  @ViewChild('onewaySearchForm') onewaySearchFormDirective;

  @ViewChild('onewayFlightTable') onewayFlightTable: MatTable<any>;
  displayedColumns: string[] = ['origin', 'destination', 'takeoffDate', 'landingDate', 'price'];

  isSearch: boolean;
  isReserve: boolean;
  
  setClickedRow : Function;
  selectedFlight: Flight = null;

  onewaySearchFormErrors = {
    'origin': '',
    'destination': '',
    'takeoffDate': ''
  };

  onewaySearchFormValidationMessages = {
    'origin': {
      'required': 'Origin of flight is required'
    },
    'destination': {
      'required': 'Destination of flight is required'
    },
    'takeoffDate': {
      'required': 'Takeoff time of flight is required'
    }
  };



  constructor(@Inject('baseURL') private baseURL,
              private flightservice: FlightApi,
              private fb: FormBuilder,
              private loginService: LoginServiceService,
              public snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.createOnewaySearchForm();
    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
    this.setClickedRow = function(index){
      this.selectedFlight = index;
    }
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onValueChangedOnewaySearch(data?: any) {
    if (!this.onewaySearchForm) {return; }
    const form = this.onewaySearchForm;
    for (const field in this.onewaySearchFormErrors){
      if (this.onewaySearchFormErrors.hasOwnProperty(field)){
        this.onewaySearchFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.onewaySearchFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.onewaySearchFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createOnewaySearchForm() {
    this.onewaySearchForm = this.fb.group({
      'origin': ['', Validators.required],
      'destination': ['', Validators.required],
      'takeoffDate': ['', Validators.required]
    });

    this.onewaySearchForm.valueChanges
      .subscribe(data => this.onValueChangedOnewaySearch(data));
    this.onValueChangedOnewaySearch();
  }

  setValueOnewaySearchForm() {
    this.onewaySearchForm.setValue({
      'origin': this.selectedFlight.origin,
      'destination': this.selectedFlight.destination,
      'takeoffDate': this.selectedFlight.takeoffDate
    });
  }

  getFlights(searchObject: any) {
    this.flightservice.find({
      'where': {
        'origin': searchObject.origin,
        'destination': searchObject.destination
      }
    })
      .subscribe(
        (result) => {
          let fullFlightList: Flight[] = result as Flight[];
          this.onewayFlightList = [];
          if (fullFlightList.length == 0) {
            this.openSnackBar('No flights match search parameters', 'Dismiss');
          }
          else {
            let compareDateStart: Date = searchObject.takeoffDate as Date;
            /*if (compareDateStart.getTimezoneOffset() < 0) {
              compareDateStart.setUTCDate(compareDateStart.getUTCDate() + 1);
            }
            compareDateStart.setUTCHours(0, 0, 0, 0);*/

            console.log("Date to check for > " + compareDateStart.toLocaleDateString());

            fullFlightList.forEach((flight) => {
              let fDate: Date = new Date(flight.takeoffDate)
              console.log("Flight date > " + fDate.toLocaleDateString());
              if (compareDateStart.toLocaleDateString() == fDate.toLocaleDateString()) {
                this.onewayFlightList.push(flight);
                console.log(flight)
              }
            });
            this.onewayFlightTable.renderRows();
          }
        },
        (err) => {
          this.openSnackBar('Error during flights search', 'Dismiss');
        }
      );
  }

  onOnewaySearchSubmit() {
    this.getFlights(this.onewaySearchForm.value);
  }



  

  setToSearch() {
    this.isSearch = true;
    this.isReserve = false;
  }

  ReserveButton() {
    if (this.selectedFlight != null) {
      console.log(this.selectedFlight);
      this.isSearch = false;
      this.isReserve = true;
    }
  }
}
