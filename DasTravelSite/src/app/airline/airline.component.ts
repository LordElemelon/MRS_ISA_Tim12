import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig, Flight, Airline, Seat, QuickFlightReservation, SeatReservation } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { AirlineApi, FlightApi, SeatApi, QuickFlightReservationApi, SeatReservationApi } from '../shared/sdk/services';
import { MatSnackBar, MatTable } from '@angular/material';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss']
})
export class AirlineComponent implements OnInit {

  userType: string;
  userId: string;

  modifyActive = true;

  flightsActive = false;
  modifyFlightActive = false;

  seatsActive = false;
  modifySeatActive = false;

  createDiscountActive = false;

  homeActive = false;
  
  setClickedRow : Function;
  setClickedSeat : Function;
  setClickedSeatD : Function;

  selectedAirline: Airline;

  selectedFlight: Flight = null;
  newFlight: Flight;
  flightList: Flight[];

  selectedSeat: Seat = null;
  newSeat: Seat;
  seatList: Seat[];
  
  selectedSeatD: Seat = null;
  seatListD: Seat[];

  displayedColumns: string[] = ['origin', 'destination', 'takeoffDate', 'landingDate', 'price'];
  displayedColumnsSeats: string[] = ['row', 'column', 'classType'];
  displayedColumnsSeatsD: string[] = ['row', 'column', 'classType'];
  classTypes = [
    {
      "value":"e",
      "viewValue":"Economy"
    }, {
      "value":"b",
      "viewValue":"Business"
    }, {
      "value":"f",
      "viewValue":"First Class"
    }];

  modifyAirlineForm: FormGroup;
  @ViewChild('modifyAirlineForm') modifyAirlineFormDirective;

  addFlightForm: FormGroup;
  @ViewChild('fformAddFlight') addFlightFormDirective;
  
  modifyFlightForm: FormGroup;
  @ViewChild('fformModifyFlight') modifyFlightFormDirective;

  addSeatForm: FormGroup;
  @ViewChild('fformAddSeat') addSeatFormDirective;
  
  modifySeatForm: FormGroup;
  @ViewChild('fformModifySeat') modifySeatFormDirective;

  createDiscountForm: FormGroup;
  @ViewChild('fformCreateDiscount') createDiscountFormDirective;

  @ViewChild('flightTable') flightTable: MatTable<any>;
  @ViewChild('seatTable') seatTable: MatTable<any>;
  @ViewChild('seatTableD') seatTableD: MatTable<any>;

  modifyAirlineFormErrors = {
    'name': ''
  };

  modifyAirlineFormValidationMessages = {
    'name': {
      'required' : 'Airline name is required'
    }
  };

  /****** FLIGHTS VALIDATION ******/

  addFlightFormErrors = {
    'origin': '',
    'destination': '',
    'takeoffDate': '',
    'landingDate': '',
    'price': ''
  };

  addFlightFormValidationMessages = {
    'origin': {
      'required': 'Origin of flight is required'
    },
    'destination': {
      'required': 'Destination of flight is required'
    },
    'takeoffDate': {
      'required': 'Takeoff time of flight is required'
    },
    'landingDate': {
      'required': 'Landing time of flight is required'
    },
    'price': {
      'required': 'Price of flight is required',
      'min': 'Price of flight must be higher than 0'
    }
  };

  modifyFlightFormErrors = {
    'origin': '',
    'destination': '',
    'takeoffDate': '',
    'landingDate': '',
    'price': ''
  };

  modifyFlightFormValidationMessages = {
    'origin': {
      'required': 'Origin of flight is required'
    },
    'destination': {
      'required': 'Destination of flight is required'
    },
    'takeoffDate': {
      'required': 'Takeoff time of flight is required'
    },
    'landingDate': {
      'required': 'Landing time of flight is required'
    },
    'price': {
      'required': 'Price of flight is required',
      'min': 'Price of flight must be higher than 0'
    }
  };

  /****** SEATS VALIDATION ******/

  addSeatFormErrors = {
    'row': '',
    'column': '',
    'classType': ''
  };

  addSeatFormValidationMessages = {
    'row': {
      'required': 'Row of seat is required'
    },
    'column': {
      'required': 'Column of seat is required'
    },
    'classType': {
      'required': 'Class of seat is required'
    }
  };

  modifySeatFormErrors = {
    'row': '',
    'column': '',
    'classType': ''
  };

  modifySeatFormValidationMessages = {
    'row': {
      'required': 'Row of seat is required'
    },
    'column': {
      'required': 'Column of seat is required'
    },
    'classType': {
      'required': 'Class of seat is required'
    }
  };

  /****** DISCOUNTS VALIDATION ******/

  createDiscountFormErrors = {
    'discount': ''
  };

  createDiscountFormValidationMessages = {
    'discount': {
      'required': 'Discount is required',
      'min': 'Discount must be higher than 0',
      'max': 'Discount must be lower than 100'
    }
  };

  /****** BASIC FUNCTIONS ******/

  constructor(@Inject('baseURL') private baseURL,
    private airlineService: AirlineApi,
    private flightService: FlightApi,
    private seatService: SeatApi,
    private seatReservationService: SeatReservationApi,
    private quickFlightReservationService: QuickFlightReservationApi,
    private loginService: LoginServiceService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);

    this.createModifyAirlineForm();
    this.createAddFlightForm();
    this.createModifyFlightForm();
    this.createAddSeatForm();
    this.createModifySeatForm();
    this.createCreateDiscountForm();

    this.setClickedRow = function(index){
      this.selectedFlight = index;
    }
    this.setClickedSeat = function(index){
      this.selectedSeat = index;
    }
    this.setClickedSeatD = function(index){
      this.selectedSeatD = index;
    }

    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        this.userId = data.user.id;
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  refreshFlights() {
    this.airlineService.getFlights(this.selectedAirline.id)
    .subscribe((flights: Flight[]) => {
      this.flightList = flights;
    });
  }

  refreshSeats() {
    this.flightService.getSeats(this.selectedFlight.id)
    .subscribe((seats: Seat[]) => {
      console.log("YA SEATS >" + JSON.stringify(seats));
      this.seatList = seats;
      this.seatTable.dataSource = this.seatList;
      this.seatTable.renderRows();
    });
  }

  refreshSeatsD() {
    this.flightService.findAvailableSeats(this.selectedFlight.id)
    .subscribe(seats => {
      this.seatListD = seats.retval;
      this.seatTableD.dataSource = this.seatListD;
      this.seatTableD.renderRows();
      console.log(seats.retval);
    });
  }

  ngOnInit() {

    this.airlineService.findOne({'where': {'name' : 'airline1'}})
    .subscribe((airline: Airline) => {
      this.selectedAirline = airline;
      this.setValueModifyAirlineForm();

      this.refreshFlights();
    });
    
  }

  /****** MODIFY AIRLINE ******/

  onValueChangedModifyAirline(data?: any) {
    if (!this.modifyAirlineForm) {return; }
    const form = this.modifyAirlineForm;
    for (const field in this.modifyAirlineFormErrors){
      if (this.modifyAirlineFormErrors.hasOwnProperty(field)){
        this.modifyAirlineFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifyAirlineFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.modifyAirlineFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createModifyAirlineForm() {
    this.modifyAirlineForm = this.fb.group({
      'name': ['', Validators.required],
      'address': '',
      'description': '',
      'destinations' : ''
    });

    this.modifyAirlineForm.valueChanges
      .subscribe(data => this.onValueChangedModifyAirline(data));
    this.onValueChangedModifyAirline();
  }

  setValueModifyAirlineForm() {
    this.modifyAirlineForm.setValue({
      'name': this.selectedAirline.name,
      'address' : this.selectedAirline.address,
      'description' : this.selectedAirline.description,
      'destinations' : this.selectedAirline.destinations
    });
  }

  onModifyAirlineSubmit() {
    this.selectedAirline = this.modifyAirlineForm.value;
    this.airlineService.updateAttributes(this.selectedAirline.id, this.selectedAirline)
    .subscribe(result => {
      this.refreshFlights();
    });
  }

  /****** ADD FLIGHT ******/

  onValueChangedAddFlight(data?: any) {
    if (!this.addFlightForm) {return; }
    const form = this.addFlightForm;
    for (const field in this.addFlightFormErrors){
      if (this.addFlightFormErrors.hasOwnProperty(field)){
        this.addFlightFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addFlightFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.addFlightFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddFlightForm() {
    this.addFlightForm = this.fb.group({
      'origin': ['', Validators.required],
      'destination': ['', Validators.required],
      'takeoffDate': ['', Validators.required],
      'landingDate': ['', Validators.required],
      'duration': 0,
      'length': 0,
      'layover': '',
      'price': [0, [Validators.required, Validators.min(1)]]
    });
    this.addFlightForm.valueChanges
    .subscribe(data => this.onValueChangedAddFlight(data));
    this.onValueChangedAddFlight();
  }

  onAddFlightSubmit() {
    this.newFlight = this.addFlightForm.value;
    this.airlineService.createFlights(this.selectedAirline.id, this.newFlight)
    .subscribe(result => {
      this.refreshFlights();
    });
  }

  /****** MODIFY FLIGHT ******/

  onValueChangedModifyFlight(data?: any) {
    if (!this.modifyFlightForm) {return; }
    const form = this.modifyFlightForm;
    for (const field in this.modifyFlightFormErrors){
      if (this.modifyFlightFormErrors.hasOwnProperty(field)){
        this.modifyFlightFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifyFlightFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.modifyFlightFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createModifyFlightForm() {
    this.modifyFlightForm = this.fb.group({
      'origin': ['', Validators.required],
      'destination': ['', Validators.required],
      'takeoffDate': ['', Validators.required],
      'landingDate': ['', Validators.required],
      'duration': 0,
      'length': 0,
      'layover': '',
      'price': [0, [Validators.required, Validators.min(1)]]
    });
    this.modifyFlightForm.valueChanges
    .subscribe(data => this.onValueChangedModifyFlight(data));
    this.onValueChangedModifyFlight();
  }

  setValueModifyFlightForm() {
    this.modifyFlightForm.setValue({
      'origin': this.selectedFlight.origin,
      'destination': this.selectedFlight.destination,
      'takeoffDate': this.selectedFlight.takeoffDate,
      'landingDate': this.selectedFlight.landingDate,
      'duration': this.selectedFlight.duration,
      'length': this.selectedFlight.length,
      'layover': this.selectedFlight.layover,
      'price': this.selectedFlight.price
    });
  }

  onModifyFlightSubmit() {
    const toModify = this.modifyFlightForm.value;
    toModify.airlineId = this.selectedAirline.id;
    console.log(this.selectedFlight);
    this.flightService.updateAttributes(this.selectedFlight.id, toModify)
    .subscribe(result => {
      console.log(result);
      this.cancelModifyFlightButton();
    })
  }

  /****** ADD SEAT ******/

  onValueChangedAddSeat(data?: any) {
    if (!this.addSeatForm) {return; }
    const form = this.addSeatForm;
    for (const field in this.addSeatFormErrors){
      if (this.addSeatFormErrors.hasOwnProperty(field)){
        this.addSeatFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addSeatFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.addSeatFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddSeatForm() {
    this.addSeatForm = this.fb.group({
      'row': ['', Validators.required],
      'column': ['', Validators.required],
      'classType': ['', Validators.required]
    });
    this.addSeatForm.valueChanges
    .subscribe(data => this.onValueChangedAddSeat(data));
    this.onValueChangedAddSeat();
  }

  onAddSeatSubmit() {
    this.newSeat = this.addSeatForm.value;
    this.flightService.createSeats(this.selectedFlight.id, this.newSeat)
    .subscribe(result => {
      this.refreshSeats();
    });
  }

  /****** MODIFY SEAT ******/

  onValueChangedModifySeat(data?: any) {
    if (!this.modifySeatForm) {return; }
    const form = this.modifySeatForm;
    for (const field in this.modifySeatFormErrors){
      if (this.modifySeatFormErrors.hasOwnProperty(field)){
        this.modifySeatFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifySeatFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.modifySeatFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createModifySeatForm() {
    this.modifySeatForm = this.fb.group({
      'row': ['', Validators.required],
      'column': ['', Validators.required],
      'classType': ['', Validators.required]
    });
    this.modifySeatForm.valueChanges
    .subscribe(data => this.onValueChangedModifySeat(data));
    this.onValueChangedModifySeat();
  }

  setValueModifySeatForm() {
    this.modifySeatForm.setValue({
      'row': this.selectedSeat.row,
      'column': this.selectedSeat.column,
      'classType': this.selectedSeat.classType
    });
  }

  onModifySeatSubmit() {
    const toModify = this.modifySeatForm.value;
    toModify.flightId = this.selectedFlight.id;
    console.log(this.selectedSeat);
    this.seatService.updateAttributes(this.selectedSeat.id, toModify)
    .subscribe(result => {
      this.refreshSeats();
      this.cancelModifySeatButton();
    })
  }

  /****** CREATE DISCOUNT ******/

  onValueChangedCreateDiscount(data?: any) {
    if (!this.createDiscountForm) {return; }
    const form = this.createDiscountForm;
    for (const field in this.createDiscountFormErrors){
      if (this.createDiscountFormErrors.hasOwnProperty(field)){
        this.createDiscountFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.createDiscountFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.createDiscountFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createCreateDiscountForm() {
    this.createDiscountForm = this.fb.group({
      'discount': [0, [Validators.required, Validators.min(1), Validators.max(99)]]
    });
    this.createDiscountForm.valueChanges
    .subscribe(data => this.onValueChangedCreateDiscount(data));
    this.onValueChangedCreateDiscount();
  }

  onCreateDiscountSubmit() {
    if (this.selectedSeatD && this.userId) {
      let discount = this.createDiscountForm.value.discount;
      let price = (this.selectedSeatD.classType == 'e') ? this.selectedFlight.price * 1.0 : 
      ((this.selectedSeatD.classType == 'f') ? this.selectedFlight.price * 1.5 : this.selectedFlight.price * 1.2);
      let totalPrice = (price * (100.0 - discount)) / 100.0;
      totalPrice = Math.round(totalPrice);
      this.seatReservationService.makeReservation(this.selectedSeatD.id, this.userId, totalPrice)
        .subscribe(
          (result) => {
            this.openSnackBar("Quick reservation successfuly made", "Dismiss");
            let quickRes: QuickFlightReservation = result.retval;

            this.quickFlightReservationService.create({discount: discount, seatReservationId: quickRes.id})
            .subscribe(
              (result) => {
                console.log("All good and well." + result);
              },
              (err) => {
                this.openSnackBar("Error in database connection", "Dismiss");
                console.log(err);
              }
            );

            this.refreshSeatsD();
          },
          (err) => {
            this.openSnackBar("Failed to make reservation", "Dismiss");
          }
        );
    }
    else {
      this.openSnackBar("You must choose the seat", "Dismiss");
    }
  }

  /****** BUTTON PRESSES ******/

  modifyButton(){
    this.modifyActive = true;

    this.flightsActive = false;
    this.modifyFlightActive = false;
    
    this.seatsActive = false;
    this.modifySeatActive = false;

    this.createDiscountActive = false;
    
    this.homeActive = false;
  }

  flightsButton(){
    this.modifyActive = false;

    this.flightsActive = true;
    this.modifyFlightActive = false;
    
    this.seatsActive = false;
    this.modifySeatActive = false;

    this.createDiscountActive = false;
    
    this.homeActive = false;

    this.flightTable.renderRows();
  }

  modifyFlightButton(){
    if (this.selectedFlight != null) {
      this.modifyActive = false;

      this.flightsActive = false;
      this.modifyFlightActive = true;
    
      this.seatsActive = false;
      this.modifySeatActive = false;

      this.createDiscountActive = false;
      
      this.homeActive = false;

      this.setValueModifyFlightForm();
    }
  }

  deleteFlightButton(){
    if (this.selectedFlight != null) {
      this.flightService.deleteById(this.selectedFlight.id)
      .subscribe(result => {
        console.log(result);
        this.selectedFlight = null;
        this.refreshFlights();
      });
    }
  }

  cancelModifyFlightButton(){
    this.modifyActive = false;

    this.flightsActive = true;
    this.modifyFlightActive = false;
    
    this.seatsActive = false;
    this.modifySeatActive = false;

    this.createDiscountActive = false;

    this.homeActive = false;

    this.selectedFlight = null;
    this.flightTable.renderRows();
  }

  homeButton(){
    this.modifyActive = false;

    this.flightsActive = false;
    this.modifyFlightActive = false;
    
    this.seatsActive = false;
    this.modifySeatActive = false;

    this.createDiscountActive = false;

    this.homeActive = true;

    this.selectedFlight = null;
  }

  manageSeatsButton() {
    if (this.selectedFlight != null) {
      this.modifyActive = false;

      this.flightsActive = false;
      this.modifyFlightActive = false;
      
      this.seatsActive = true;
      this.modifySeatActive = false;

      this.createDiscountActive = false;

      this.homeActive = false;
      
      this.refreshSeats();
    }
  }

  modifySeatButton(){
    if (this.selectedSeat != null) {
      this.modifyActive = false;

      this.flightsActive = false;
      this.modifyFlightActive = false;
    
      this.seatsActive = false;
      this.modifySeatActive = true;

      this.createDiscountActive = false;
      
      this.homeActive = false;

      this.setValueModifySeatForm();
    }
  }

  deleteSeatButton(){
    if (this.selectedSeat != null) {
      this.seatService.deleteById(this.selectedSeat.id)
      .subscribe(result => {
        console.log(result);
        this.selectedSeat = null;
        this.refreshSeats();
      });
    }
  }

  cancelModifySeatButton(){
    this.modifyActive = false;

    this.flightsActive = false;
    this.modifyFlightActive = false;
    
    this.seatsActive = true;
    this.modifySeatActive = false;

    this.createDiscountActive = false;

    this.homeActive = false;

    this.selectedSeat = null;
    this.seatTable.renderRows();
  }

  createDiscountButton() {
    if (this.selectedFlight != null) {
      this.modifyActive = false;

      this.flightsActive = false;
      this.modifyFlightActive = false;
      
      this.seatsActive = false;
      this.modifySeatActive = false;

      this.createDiscountActive = true;

      this.homeActive = false;
      
      this.refreshSeatsD();
    }
  }

  cancelCreateDiscountButton() {
    this.modifyActive = false;

    this.flightsActive = true;
    this.modifyFlightActive = false;
    
    this.seatsActive = false;
    this.modifySeatActive = false;

    this.createDiscountActive = false;

    this.homeActive = false;

    this.selectedSeatD = null;
    this.flightTable.renderRows();
  }

}
