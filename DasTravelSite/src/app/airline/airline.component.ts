import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig, Flight } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { AirlineApi } from '../shared/sdk/services';
import { Airline } from '../shared/sdk/models/Airline';

@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss']
})
export class AirlineComponent implements OnInit {

  modifyActive = true;
  addFlightActive = false;
  alterFlightsActive = false;
  modifyFlightActive = false;
  
  setClickedRow : Function;

  selectedAirline: Airline;
  selectedFlight: Flight;
  flightList: Flight[];
  displayedColumns: string[] = ['origin', 'destination', 'takeoffDate', 'landingDate', 'price'];

  modifyAirlineForm: FormGroup;
  @ViewChild('modifyAirlineForm') modifyAirlineFormDirective;
  

  modifyAirlineFormErrors = {
    'name': ''
  };

  modifyAirlineFormValidationMessages = {
    'name': {
      'required' : 'Airline name is required'
    }
  };

  constructor(@Inject('baseURL') private baseURL,
    private airlineservice: AirlineApi,
    private fb: FormBuilder
  ) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.createModifyAirlineForm();
    this.setClickedRow = function(index){
      this.selectedFlight = index;
    }
  }

  ngOnInit() {

    this.airlineservice.findOne({'where': {'name' : 'airline1'}})
    .subscribe((airline: Airline) => {
      this.selectedAirline = airline;
      this.setValueModifyAirlineForm();

      this.airlineservice.getFlights(this.selectedAirline.id)
      .subscribe((flights: Flight[]) => {
        this.flightList = flights;

      });

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
    .subscribe(result => {});
  }

}
