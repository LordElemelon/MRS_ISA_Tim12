import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-discounts',
  templateUrl: './car-discounts.component.html',
  styleUrls: ['./car-discounts.component.scss']
})
export class CarDiscountsComponent implements OnInit {


  addForm: FormGroup;
  @ViewChild('addform') addFormDirective;

  constructor(private loginService: LoginServiceService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder) { 
    loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
    this.createAddForm();
  }

  isAdd: boolean = null;
  isRemove: boolean = null;
  isChange: boolean = null;
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
  }

  setToRemove() {
    this.isAdd = null;
    this.isRemove = true;
    this.isChange = null;
  }

  setToChange() {
    this.isAdd = null;
    this.isRemove = null;
    this.isChange = true;
  }

  addFormErrors = {
    'start': '',
    'end': '',
    'registration': '',
    'price': ''
  };

  addFormValidationMessages = {
    'start': {
      'required': 'Start time is required'
    },
    'end': {
      'required': 'End time is required'
    },
    'registration': {
      'required': 'Registration is required'
    },
    'price': {
      'required': 'Price is required',
      'pattern': 'Price has to be a number'
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
  }

  createAddForm() {
    this.addForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      registration: ['', Validators.required],
      price: [0, [Validators.required, Validators.pattern]]
    })
    this.addForm.valueChanges.subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  onAddSubmit() {
    console.log("Submit pressed");
  }



}
