import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig } from '../shared/sdk';
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

  addForm: FormGroup;
  toAddAirline: Airline;
  @ViewChild('addform') addFormDirective;

  modifyAirlineFormErrors = {
    'name': '',
    'address': ''
  };

  modifyAirlineFormValidationMessages = {
    'name': {
      'required' : 'Airline name is required'
    },
    'address': {
      'required' : 'Airline address is required'
    }
  };

  constructor(@Inject('baseURL') private baseURL,
    private airlineservice: AirlineApi,
    private fb: FormBuilder
  ) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    
  }

  ngOnInit() {
  }

}
