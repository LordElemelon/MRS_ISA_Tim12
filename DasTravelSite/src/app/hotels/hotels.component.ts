import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LoopBackConfig } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { HotelApi } from '../shared/sdk/services';
import { Hotel } from '../shared/sdk/models/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {LoginServiceService} from '../login-service.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

  foundHotels: Hotel[];
  addActive = true;
  removeActive = false;
  modifyActive = false;
  added = false;
  userType: string;

  // form related objects
  hotelForm: FormGroup;
  newHotel: Hotel;
  params = {};
  @ViewChild('fformAdd') hotelFormDirective;

  searchHotelForm: FormGroup;
  searchHotelParameters: Hotel;
  hotelsFound: Hotel[];
  @ViewChild('fformSearchHotels') searchHotelFormDirective;

  formErrors = {
    'name': '',
    'address': ''
  };

  validationMessages = {
    'name': {
      'required' : 'Hotel name is required'
    },
    'address': {
      'required' : 'Hotel address is required'
    }
  };

  searchHotelFormErrors = {};
  searchHotelFormValidationMessages = {};

  constructor(@Inject('baseURL') private baseURL,
    private hotelservice: HotelApi,
    private fb: FormBuilder,
    private loginService: LoginServiceService,
    public snackBar: MatSnackBar
    ) {

      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createForm();
      this.createSearchHotelForm();
      this.loginService.user.subscribe(data => {
        if (data) {
          this.userType = data.user.type;
        }
      });
   }

  ngOnInit() {
    this.hotelservice.find().subscribe((hotels: Hotel[]) => this.foundHotels = hotels);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onValueChanged(data?: any)  {
    if (!this.hotelForm) {return; }
    const form = this.hotelForm;
    for (const field in this.formErrors)  {
      if (this.formErrors.hasOwnProperty(field))  {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createForm() {
    this.hotelForm = this.fb.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required],
      'description': ''
    });

    this.hotelForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    this.newHotel = this.hotelForm.value;
    this.hotelservice.create(this.newHotel)
    .subscribe(result =>  {
      this.hotelForm.reset({
        name: '',
        address: '',
        description: '',
      });
      this.hotelFormDirective.resetForm();
      this.openSnackBar('Added a hotel succesfully', 'Dismiss');
    }, err =>  {
      this.openSnackBar('Can not add this hotel. Check if the name is already taken', 'Dismiss');
    });

  }


  onValueChangedSearchHotels(data?: any)  {
    if (!this.searchHotelForm) {return; }
    const form = this.searchHotelForm;
    for (const field in this.searchHotelFormErrors)  {
      if (this.searchHotelFormErrors.hasOwnProperty(field))  {
        this.searchHotelFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.searchHotelFormValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.searchHotelFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createSearchHotelForm() {
    this.searchHotelForm = this.fb.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required]
    });

    this.searchHotelForm.valueChanges
      .subscribe(data => this.onValueChangedSearchHotels(data));
    this.onValueChangedSearchHotels();
  }

  onSearchHotelsSubmit() {
    this.searchHotelParameters = this.searchHotelForm.value;
    this.params = {};
    if (this.searchHotelParameters.name != '' && this.searchHotelParameters.name != undefined){
      this.params['name'] = this.searchHotelParameters.name;
    }
    if (this.searchHotelParameters.address != '' && this.searchHotelParameters.address != undefined){
      this.params['address'] = this.searchHotelParameters.address;
    }
    if (this.params !== {})  {
      this.hotelservice.find({where : this.params})
      .subscribe((result: Hotel[]) =>  {
        this.hotelsFound = result;
      }, err => {
        this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
      });
    } else{
      this.hotelservice.find()
      .subscribe((result: Hotel[]) =>  {
        this.hotelsFound = result;
      }, err => {
        this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
      });
    }
  }

  addButton()  {
    this.addActive = true;
    this.removeActive = false;
    this.modifyActive = false;
  }

  removeButton()  {
    this.addActive = false;
    this.removeActive = true;
    this.modifyActive = false;
  }

  modifyButton()  {
    this.addActive = false;
    this.removeActive = false;
    this.modifyActive = true;
  }

}
