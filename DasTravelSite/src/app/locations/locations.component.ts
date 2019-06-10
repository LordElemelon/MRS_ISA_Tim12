import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {LocationApi} from '../shared/sdk/services/custom';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  addLocationForm: FormGroup;
  @ViewChild('fformAddLocation') addLocationFormDirective;

  addLocationFormErrors = {
    'country': '',
    'city': ''
  };

  addLocationValidationMessages = {
    'country': {
      'required' : 'Country is required'
    },
    'city': {
      'required' : 'City is required'
    }
  };

  constructor(@Inject('baseURL') private baseURL,
              private locationsservice: LocationApi,
              private fb: FormBuilder,
              public snackBar: MatSnackBar) {
    this.createAddLocationForm();
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onAddLocationValueChanged(data?: any)  {
    if (!this.addLocationForm) {return; }
    const form = this.addLocationForm;
    for (const field in this.addLocationFormErrors)  {
      if (this.addLocationFormErrors.hasOwnProperty(field))  {
        this.addLocationFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addLocationValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.addLocationFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddLocationForm() {
    this.addLocationForm = this.fb.group({
      'country': ['', Validators.required],
      'city': ['', Validators.required],
    });

    this.addLocationForm.valueChanges
      .subscribe(data => this.onAddLocationValueChanged(data));
    this.onAddLocationValueChanged();
  }

  onAddLocationSubmit() {
    const country = this.addLocationForm.value.country;
    const city = this.addLocationForm.value.city;
    this.locationsservice.create({'country': country, 'city': city})
      .subscribe(result =>  {
        this.addLocationForm.reset({
          country: '',
          city: ''
        });
        this.addLocationFormDirective.resetForm();
        this.openSnackBar('Added a location succesfully', 'Dismiss');
      }, err =>  {
        this.openSnackBar('Can not add this location. Maybe it already exists', 'Dismiss');
      });

  }
}
