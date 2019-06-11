import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig, UserInfo, Myuser, MyuserApi } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { MatSelectModule} from '@angular/material/select';
import { MatSnackBar } from '@angular/material';
import { UserInfoApi } from '../shared/sdk';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  modifyActive = true;
  homeActive = false;
  changePasswordActive = false;
  friendsActive = false;

  loggedUser: Myuser;
  userInfo: UserInfo;
  hasInfo: boolean;
  genders = [
    {
      "value":"m",
      "viewValue":"Male"
    }, {
      "value":"f",
      "viewValue":"Female"
    }, {
      "value":"l",
      "viewValue":"Llama"
    }];

  modifyUserFormErrors = [];
  modifyUserFormValidationMessages = [];

  changePasswordFormErrors = {
    'oldPassword': '',
    'newPassword': ''
  };

  changePasswordFormValidationMessages = {
    'oldPassword': {
      'required': 'Old password has to be filled in',
    },
    'newPassword': {
      'required': 'New password has to be filled in'
    }
  };


  modifyUserForm: FormGroup;
  @ViewChild('modifyUserForm') modifyUserFormDirective;

  changePasswordForm: FormGroup;
  @ViewChild('changepasswordform') changePasswordFormDirective;

  constructor(@Inject('baseURL') private baseURL,
    private userinfoservice: UserInfoApi,
    private myuserservice: MyuserApi,
    private fb: FormBuilder,
    public snackBar: MatSnackBar
  ) { 
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.createModifyUserForm();
    this.createChangePasswordForm();
  }

  ngOnInit() {
    this.loggedUser = this.myuserservice.getCachedCurrent();
    console.log(this.loggedUser);
    console.log(this.loggedUser.id);
    this.hasInfo = false;
    this.userinfoservice.find().subscribe(
      (users: UserInfo[]) => {
        users.forEach(user => {
          if (user.userIdId == this.loggedUser.id) {
            this.userInfo = user;
            this.setValueModifyUserForm();
            console.log(user);
            this.hasInfo = true;
          }
        });
        if (!this.hasInfo) {
          this.userInfo = new UserInfo();
          this.userInfo.userIdId = this.loggedUser.id;
        }
      }
    );
    /*this.userinfoservice.findOne({'where': {'userIdId': this.loggedUser.id}, 'include': 'userId'})
    .subscribe(
      (user: UserInfo) => {
        this.userInfo = user;
        this.setValueModifyUserForm();
        console.log(user);
        this.hasInfo = true;
      },
      (error) => {
        this.userInfo = new UserInfo();
        this.userInfo.userIdId = this.loggedUser.id;
        console.log(error);
        this.hasInfo = false;
      }
    );*/
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  onValueChangedModifyUser(data?: any) {
    if (!this.modifyUserForm) {return; }
    const form = this.modifyUserForm;
    for (const field in this.modifyUserFormErrors){
      if (this.modifyUserFormErrors.hasOwnProperty(field)){
        this.modifyUserFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifyUserFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.modifyUserFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onValueChangedChangePassword(data?: any) {
    if (!this.changePasswordForm) {return; }
    const form = this.changePasswordForm;
    for (const field in this.changePasswordFormErrors){
      if (this.changePasswordFormErrors.hasOwnProperty(field)){
        this.changePasswordFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.changePasswordFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.changePasswordFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createModifyUserForm() {
    this.modifyUserForm = this.fb.group({
      'firstName': '',
      'lastName': '',
      'dateOfBirth': '',
      'gender' : '',
      'phoneNumber' : '',
      'aboutMe' : ''
    });
    this.modifyUserForm.valueChanges
      .subscribe(data => this.onValueChangedModifyUser(data));
    this.onValueChangedModifyUser();
  }

  createChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      'oldPassword': ['', Validators.required],
      'newPassword': ['', Validators.required]
    });
    this.changePasswordForm.valueChanges
    .subscribe(data => this.onValueChangedChangePassword(data));
    this.onValueChangedChangePassword();
  }

  setValueModifyUserForm() {
    this.modifyUserForm.setValue({
      'firstName': this.userInfo.firstName,
      'lastName': this.userInfo.lastName,
      'dateOfBirth': this.userInfo.dateOfBirth,
      'gender' : this.userInfo.gender,
      'phoneNumber' : this.userInfo.phoneNumber,
      'aboutMe' : this.userInfo.aboutMe
    });
  }

  onModifyUserSubmit() {
    if (this.hasInfo) {
      let id = this.userInfo.id;
      this.userInfo = this.modifyUserForm.value;
      this.userInfo.userIdId = this.loggedUser.id;
      this.userInfo.userId = this.loggedUser;
      this.userinfoservice.updateAttributes(id, this.userInfo)
      .subscribe(result => {
        console.log("Updating>>> \n" + result);
      });
    }
    else {
      this.userInfo = this.modifyUserForm.value;
      this.userInfo.userIdId = this.loggedUser.id;
      this.userInfo.userId = this.loggedUser;
      this.userinfoservice.create(this.userInfo)
      .subscribe(result => {
        console.log("Creating>>> \n" + result);
      });
    }
    
  }

  onChangePasswordSubmit() {
    this.myuserservice.changePassword(this.changePasswordForm.value.oldPassword, this.changePasswordForm.value.newPassword)
    .subscribe(
      (result) => {
        this.openSnackBar("Password successfully changed", "Dismiss");
      },
      (err) => {
        this.openSnackBar("Failed to change password", "Dismiss");
      }
    )
  }

  modifyButton(){
    this.modifyActive = true;
    this.homeActive = false;
    this.changePasswordActive = false;
    this.friendsActive = false;
  }

  changePasswordButton() {
    this.changePasswordActive = true;
    this.modifyActive = false;
    this.homeActive = false;
    this.friendsActive = false;
  }

  friendsButton() {
    this.changePasswordActive = false;
    this.modifyActive = false;
    this.homeActive = false;
    this.friendsActive = true;
  }

}
