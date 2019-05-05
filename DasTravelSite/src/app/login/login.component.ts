import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {LoopBackConfig} from '../shared/sdk';
import {API_VERSION} from '../shared/baseUrl';
import {MyuserApi} from '../shared/sdk/services';

import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginServiceService} from '../login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @ViewChild('loginform') loginFormDirective;
  
  constructor(@Inject('baseURL') private baseURL,
              private myUserService: MyuserApi,
              private loginService: LoginServiceService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<LoginComponent>,
              public snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
    this.loginForm.valueChanges
      .subscribe((data) => this.onLoginValueChanged(data));
    this.onLoginValueChanged();
  }

  loginFormErrors = {
    'username': '',
    'password': ''
  };

  loginFormValidationMessages = {
    'username': {
      'required': 'Username is required'
    },
    'password': {
      'required': 'Password is required'
    }
  };

  onLoginValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
    for (const field in this.loginFormErrors) {
      if (this.loginFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.loginFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.loginFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.loginFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onLoginSubmit() {
    this.myUserService.login({
      'username': this.loginForm.value.username,
      'password': this.loginForm.value.password
    })
      .subscribe((result) => {
          this.dialogRef.close();
          this.openSnackBar('Successfully loged in, welcome', 'Dismiss');
          this.loginService.observableUser.next(result);
        },
        (err) => {
          this.openSnackBar('Wrong credentials, try again', 'Dismiss');
        });
  }

}
