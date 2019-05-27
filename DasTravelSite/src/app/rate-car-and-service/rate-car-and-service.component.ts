import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MyuserApi, LoopBackConfig, CarReservationApi } from '../shared/sdk';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import { API_VERSION } from '../shared/baseUrl';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-rate-car-and-service',
  templateUrl: './rate-car-and-service.component.html',
  styleUrls: ['./rate-car-and-service.component.scss']
})
export class RateCarAndServiceComponent implements OnInit {


  rateForm: FormGroup;
  @ViewChild('rateform') rateFormDirective;

  constructor(@Inject('baseURL') private baseURL,
    private myUserService: MyuserApi,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RateCarAndServiceComponent>,
    public snackBar: MatSnackBar,
    public carReservationService: CarReservationApi,
    private itemService: ItemService) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createRateForm();
  }

  ngOnInit() {
  }

  createRateForm() {
    this.rateForm = this.fb.group({
      'carRate': ['', Validators.required],
      'rentalRate': ['', Validators.required]
    });
    this.rateForm.valueChanges
    .subscribe((data) => this.onRateValueChanged(data));
    this.onRateValueChanged();
  }

  onRateValueChanged(data?:any) {
    if (!this.rateForm) { return; }
    const form = this.rateForm;
    for (const field in this.rateFormErrors) {
      if (this.rateFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.rateFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.rateFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.rateFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  rateFormErrors = {
    'carRate': '',
    'rentalRate': ''
  }

  rateFormValidationMessages = {
    'carRate': {
      'required': 'Car rating is required'
    },
    'rentalRate': {
      'required': 'Rental rating is required'
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  onRateSubmit() {
    var rId = this.itemService.getCarReservationIdForRate();
    this.carReservationService.rateServiceAndCar(rId, this.rateForm.value.carRate,
       this.rateForm.value.rentalRate)
    .subscribe(
      (result) => {
        this.openSnackBar("Thank you for your input!", "Dismiss");
        this.dialogRef.close();
      },
      (err) => {
        this.openSnackBar("Failed to add rating", "Dismiss");
      }
    )
  }

}
