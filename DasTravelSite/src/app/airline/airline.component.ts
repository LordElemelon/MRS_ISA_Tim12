import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig, Flight } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { AirlineApi, FlightApi } from '../shared/sdk/services';
import { Airline } from '../shared/sdk/models/Airline';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss']
})
export class AirlineComponent implements OnInit {

  modifyActive = true;
  flightsActive = false;
  modifyFlightActive = false;
  homeActive = false;
  
  setClickedRow : Function;

  selectedAirline: Airline;
  selectedFlight: Flight = null;
  newFlight: Flight;
  flightList: Flight[];
  displayedColumns: string[] = ['origin', 'destination', 'takeoffDate', 'landingDate', 'price'];

  modifyAirlineForm: FormGroup;
  @ViewChild('modifyAirlineForm') modifyAirlineFormDirective;

  addFlightForm: FormGroup;
  @ViewChild('fformAddFlight') addFlightFormDirective;
  
  modifyFlightForm: FormGroup;
  @ViewChild('fformModifyFlight') modifyFlightFormDirective;
  

  modifyAirlineFormErrors = {
    'name': ''
  };

  modifyAirlineFormValidationMessages = {
    'name': {
      'required' : 'Airline name is required'
    }
  };

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

  constructor(@Inject('baseURL') private baseURL,
    private airlineservice: AirlineApi,
    private flightservice: FlightApi,
    private fb: FormBuilder
  ) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.createModifyAirlineForm();
    this.createAddFlightForm();
    this.createModifyFlightForm();
    this.setClickedRow = function(index){
      this.selectedFlight = index;
    }
  }

  refreshFlights() {
    this.airlineservice.getFlights(this.selectedAirline.id)
    .subscribe((flights: Flight[]) => {
      this.flightList = flights;
    });
  }

  ngOnInit() {

    this.airlineservice.findOne({'where': {'name' : 'airline1'}})
    .subscribe((airline: Airline) => {
      this.selectedAirline = airline;
      this.setValueModifyAirlineForm();

      this.refreshFlights();
    });
    
  }

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
    this.airlineservice.updateAttributes(this.selectedAirline.id, this.selectedAirline)
    .subscribe(result => {
      this.refreshFlights();
    });
  }

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
    this.airlineservice.createFlights(this.selectedAirline.id, this.newFlight)
    .subscribe(result => {
      this.refreshFlights();
    });
  }

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
    this.flightservice.updateAttributes(this.selectedFlight.id, toModify)
    .subscribe(result => {
      console.log(result);
      this.cancelModifyFlightButton();
    })
  }



  modifyButton(){
    this.modifyActive = true;
    this.flightsActive = false;
    this.modifyFlightActive = false;
    this.homeActive = false;
  }

  flightsButton(){
    this.modifyActive = false;
    this.flightsActive = true;
    this.modifyFlightActive = false;
    this.homeActive = false;
    this.refreshFlights();
  }

  modifyFlightButton(){
    if (this.selectedFlight != null) {
      this.modifyActive = false;
      this.flightsActive = false;
      this.modifyFlightActive = true;
      this.homeActive = false;
      this.setValueModifyFlightForm();
    }
  }

  deleteFlightButton(){
    if (this.selectedFlight != null) {
      this.flightservice.deleteById(this.selectedFlight.id)
      .subscribe(result => {
        console.log(result);
        this.refreshFlights();
      });
    }
  }

  cancelModifyFlightButton(){
    this.modifyActive = false;
    this.flightsActive = true;
    this.modifyFlightActive = false;
    this.homeActive = false;
    this.selectedFlight = null;
    this.refreshFlights();
  }

  homeButton(){
    this.modifyActive = false;
    this.flightsActive = false;
    this.modifyFlightActive = false;
    this.homeActive = true;
  }

}
