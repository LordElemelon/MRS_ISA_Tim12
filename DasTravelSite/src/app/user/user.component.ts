import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig, UserInfo, UserInfoApi, Myuser, MyuserApi } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  modifyActive = true;
  homeActive = false;

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

  modifyUserForm: FormGroup;
  @ViewChild('modifyUserForm') modifyUserFormDirective;

  constructor(@Inject('baseURL') private baseURL,
    private userinfoservice: UserInfoApi,
    private myuserservice: MyuserApi,
    private fb: FormBuilder
  ) { 
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.createModifyUserForm();
  }

  ngOnInit() {
    this.loggedUser = this.myuserservice.getCachedCurrent();
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

  modifyButton(){
    this.modifyActive = true;
    this.homeActive = false;
  }

}
