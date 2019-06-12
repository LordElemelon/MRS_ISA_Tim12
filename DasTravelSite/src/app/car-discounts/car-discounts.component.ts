import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CarApi} from '../shared/sdk';
import {ItemService} from '../services/item.service';
import { CarSpecialOfferApi } from '../shared/sdk/services'

@Component({
  selector: 'app-car-discounts',
  templateUrl: './car-discounts.component.html',
  styleUrls: ['./car-discounts.component.scss']
})
export class CarDiscountsComponent implements OnInit {


  addForm: FormGroup;
  @ViewChild('addform') addFormDirective;

  deleteForm: FormGroup;
  @ViewChild('deleteform') deleteFormDirective;

  changeForm: FormGroup;
  @ViewChild('changeform') changeFormDirective;

  constructor(private loginService: LoginServiceService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private carService: CarApi,
    private itemService: ItemService,
    private specialOfferService: CarSpecialOfferApi) { 
    loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
    this.createAddForm();
    this.createDeleteForm();
    this.createChangeForm();
  }

  isAdd: boolean = null;
  isRemove: boolean = null;
  isChange: boolean = null;
  isList : boolean = null;
  userType: any;

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  ngOnInit() {
  }

  setToAdd() {
    this.isAdd = true;
    this.isRemove = null;
    this.isChange = null;
    this.isList = null;
  }

  setToRemove() {
    this.isAdd = null;
    this.isRemove = true;
    this.isChange = null;
    this.isList = null;
  }

  setToChange() {
    this.isAdd = null;
    this.isRemove = null;
    this.isChange = true;
    this.isList = null;
  }

  setToList() {
    this.isAdd = null;
    this.isRemove = null;
    this.isChange = null;
    this.isList = true;
  }

  addFormErrors = {
    'start': '',
    'end': '',
    'registration': '',
    'discount': ''
  };

  addFormValidationMessages = {
    'start': {
      'required': 'Start time is required',
      'minv': 'Start time has to be smaller than end time',
      'ming': 'Start time has to be after today'
    },
    'end': {
      'required': 'End time is required'
    },
    'registration': {
      'required': 'Registration is required'
    },
    'discount': {
      'required': 'Discount is required',
      'pattern': 'Discount has to be a number'
    }
  };

  onAddValueChanged(data?: any) {
    if (!this.addForm) {
      return;
    }
    const form = this.addForm;
    for (const field in this.addFormErrors) {
      if (this.addFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.addFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.addFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }

    const startDate = new Date(this.addForm.get('start').value);
    const now = new Date();
    const endDate = new Date(this.addForm.get('end').value);

    if (startDate > endDate) {
      this.addFormErrors['start'] += this.addFormValidationMessages['start']['minv'] + ' ';
      this.addForm.controls['start'].setErrors({'minv' : true});
    }

    if (startDate < now ) {
      this.addFormErrors['start'] += this.addFormValidationMessages['start']['ming'] + ' ';
      this.addForm.controls['start'].setErrors({'ming' : true});
    }



  }

  onDeleteValueChanged(data?: any) {
    if (!this.deleteForm) {
      return;
    }
    const form = this.deleteForm;
    for (const field in this.deleteFormErrors) {
      if (this.deleteFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.deleteFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.deleteFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.deleteFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onChangeValueChanged(data? : any) {
    if (!this.changeForm) {
      return;
    }
    const form = this.changeForm;
    for (const field in this.changeFormErrors) {
      if (this.changeFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.changeFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.changeFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.changeFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  deleteFormErrors = {
    'start': '',
    'registration': ''
  };

  deleteFormValidationMessages = {
    'start': {
      'required': 'Start time is required'
    },
    'registration': {
      'required': 'Registration is required'
    }
  };

  changeFormErrors = {
    'start': '',
    'registration': '',
    'newDiscount': ''
  };

  changeFormValidationMessages = {
    'start': {
      'required': 'Start time is required'
    },
    'registration': {
      'required': 'Registration is required'
    },
    'newDiscount': {
      'required': 'New discount value is required',
      'pattern': 'Discount has to be a number'
    }
  };

  createAddForm() {
    this.addForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      registration: ['', Validators.required],
      discount: [0, [Validators.required, Validators.pattern]]
    });
    this.addForm.valueChanges.subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  createDeleteForm() {
    this.deleteForm = this.fb.group({
      registration: ['', Validators.required],
      start: ['', Validators.required]
    });
    this.deleteForm.valueChanges.subscribe(data => this.onDeleteValueChanged(data));
    this.onDeleteValueChanged();
  }

  createChangeForm() {
    this.changeForm = this.fb.group({
      registration: ['', Validators.required],
      start: ['', Validators.required],
      newDiscount: ['', [Validators.required, Validators.pattern]]
    });
    this.changeForm.valueChanges.subscribe(data => this.onChangeValueChanged(data));
    this.onChangeValueChanged();
  }

  matchCarAndPrice(car, prices, start) {
    car.price = 0;
      car.start = new Date(0);
      car.category = "B"; //ovaj red treba izbaciti, tu je zarad testiranja
      for (let price of prices) {
        if (car.rentalServiceId == price.rentalServiceId) {
          if (start > price.start && car.start < price.start) {
            car.start = price.start;
            car.price = price['cat' + car.category + 'Price'];
          }
        }
      }
  }

  onAddSubmit() {
    this.carService.findOne({'where': {'registration': this.addForm.value.registration}})
    .subscribe(
      (car) => {
        var car_res = car as any;
        this.itemService.getPrices().subscribe(
          (prices) => {
            this.matchCarAndPrice(car_res, prices, this.addForm.value.start)
            var startDate = new Date(this.addForm.value.start).toJSON();
            var endDate = new Date(this.addForm.value.end).toJSON();

            console.log(startDate);
            console.log(endDate);

            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            var days = 1 + Math.round(Math.abs((new Date(startDate).getTime() - new Date(endDate).getTime())/(oneDay)));
            var totalPrice = days * car_res.price
            this.specialOfferService.makeSpecialOffer(startDate, endDate, car_res.id,
               totalPrice, car_res.rentalServiceId, this.addForm.value.discount, car_res.registration)
            .subscribe((result) => {
              this.openSnackBar("Successfully added special offer at this date", "Dismiss");
            },
            (err) => {
              this.openSnackBar("Failed to make a special offer at this date", "Dismiss");
            })
          },
          (err) => {
            this.openSnackBar("Failed to retrieve prices", "Dismiss");
          });
      },
      (err) => {
        this.openSnackBar("No car with this registration exists", "Dismiss");
      }
    )
  }

  onDeleteSubmit() {
    this.specialOfferService.removeOffer(new Date(this.deleteForm.value.start).toJSON(), this.deleteForm.value.registration)
    .subscribe((result) => {
      if (result.retval.count == 0) {
        this.openSnackBar("No special offer like this exists", "Dismiss");
      } else {
        this.openSnackBar("Successfully removed special offer", "Dismiss");
      }
    },
    (err) => {
      this.openSnackBar("Could not delete this special offer, already reserved", "Dismiss");
    })
  }

  onChangeSubmit() {
    this.specialOfferService.changeOffer(new Date(this.changeForm.value.start).toJSON(), this.changeForm.value.registration,
     this.changeForm.value.newDiscount)
    .subscribe(
      (result) => {
        if (result.retval.count == 0) {
          this.openSnackBar("No special offer like this exists", "Dismiss");
        } else {
          this.openSnackBar("Successfully changed special offer", "Dismiss");
        }
    },
    (err) => {
      this.openSnackBar("Could not change this special offer, already reserved", "Dismiss");
    })
  }
}


