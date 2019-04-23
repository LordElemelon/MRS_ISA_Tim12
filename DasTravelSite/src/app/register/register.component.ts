import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyuserApi, LoopBackConfig } from '../shared/sdk';
import { LoginComponent } from '../login/login.component';
import { API_VERSION } from '../shared/baseUrl';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  @ViewChild('registerform') registerFormDirective;

  constructor(@Inject('baseURL') private baseURL,
    private myUserService: MyuserApi,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegisterComponent>,
    public snackBar: MatSnackBar) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]]
    })
    this.registerForm.valueChanges
    .subscribe((data) => this.onRegisterValueChanged(data));
    this.onRegisterValueChanged();
  }

  onRegisterValueChanged(data?:any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;
    for (const field in this.registerFormErrors) {
      if (this.registerFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.registerFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.registerFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.registerFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  registerFormErrors = {
    'username': '',
    'password': '',
    'email': ''
  }

  registerFormValidationMessages = {
    'username': {
      'required': 'Username is required'
    },
    'password': {
      'required': 'Password is required'
    },
    'email': {
      'required': 'Email is required',
      'email': 'This has to be a valid email address'
    }
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  onRegisterSubmit() {
    this.myUserService.create({
      'username': this.registerForm.value.username,
      'password': this.registerForm.value.password,
      'email': this.registerForm.value.email
    })
    .subscribe(
      (result) => {
        this.openSnackBar("Registration successfull", "Dismiss");
        this.dialogRef.close();
      },
      (err) => {
        this.openSnackBar("Registration failed", "Dismiss");
      });
  }

  

}
