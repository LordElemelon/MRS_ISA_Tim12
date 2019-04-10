import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LoopBackConfig } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { HotelApi } from '../shared/sdk/services';
import { Hotel } from '../shared/sdk/models/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  // form related objects
  hotelForm: FormGroup;
  newHotel: Hotel;
  @ViewChild('fformAdd') hotelFormDirective;

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
  }

  constructor(@Inject('baseURL') private baseURL,
    private hotelservice: HotelApi,
    private fb: FormBuilder
    ) {

      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createForm();
   }

  ngOnInit() {
    this.hotelservice.find().subscribe((hotels: Hotel[]) => this.foundHotels = hotels);
  }

  addButton(){
    this.addActive = true;
    this.removeActive = false;
    this.modifyActive = false;
  }

  removeButton(){
    this.addActive = false;
    this.removeActive = true;
    this.modifyActive = false;
  }

  modifyButton(){
    this.addActive = false;
    this.removeActive = false;
    this.modifyActive = true;
  }

  onValueChanged(data?:any){
    if (!this.hotelForm) {return;}
    const form = this.hotelForm;
    for (const field in this.formErrors){
      if (this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
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
    .subscribe(result =>{
      this.hotelForm.reset({
        name: '',
        address: '',
        description: '',
      });
      this.hotelFormDirective.resetForm();
      this.added = true;
      setTimeout(() =>{ this.added = false; }, 3000);
    });

  }

}
