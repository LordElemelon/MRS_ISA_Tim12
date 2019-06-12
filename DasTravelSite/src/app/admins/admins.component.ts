import { Component, OnInit } from '@angular/core';
import {LoginServiceService} from '../login-service.service';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AirlineApi, HotelApi, MyuserApi, RentalServiceApi} from '../shared/sdk/services/custom';
import {Observable} from 'rxjs';
import {Airline, Hotel, RentalService} from '../shared/sdk/models';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  userType: string;
  addActive = true;
  selectedType = 'airportAdmin';
  availableCompanies = ['1', 'cao', '3'];
  selectedCompany = '';
  addAdminForm: FormGroup;
  addAdminFormErrors = {
    'username': '',
    'email': ''
  };

  airlines: Airline[] = [];
  hotels: Hotel[] = [];
  rentalServices: RentalService[] = [];

  addAdminFormValidationMessages = {
    'username': {
      'required': 'Username is required'
    },
    'email': {
      'required': 'E-mail is required'
    }
  };

  constructor(
    private loginService: LoginServiceService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private airlineservice: AirlineApi,
    private hotelservice: HotelApi,
    private rentalserviceservice: RentalServiceApi,
    private myuserservice: MyuserApi
  ) {
    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
    this.airlineservice.find({where: {myuserId: ''}})
      .subscribe((result: Airline[]) => {
        this.airlines = result;
        this.changeCompanies();
      });
    this.hotelservice.find({where: {myuserId: ''}})
      .subscribe((result: Hotel[]) => this.hotels = result);
    this.rentalserviceservice.find({where: {myuserId: ''}})
      .subscribe((result: RentalService[]) => this.rentalServices = result);
    this.createAddAidminForm();
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onAddAdminValueChanged(data?: any) {
    if (!this.addAdminForm) return;
    const form = this.addAdminForm;
    for (const field in this.addAdminFormErrors)  {
      if (this.addAdminFormErrors.hasOwnProperty(field))  {
        this.addAdminFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addAdminFormValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.addAdminFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddAidminForm() {
    this.addAdminForm = this.fb.group({
      'username': ['', Validators.required],
      'email': ['', Validators.required]
    });
    this.addAdminForm.valueChanges
      .subscribe(data => this.onAddAdminValueChanged(data));
    this.onAddAdminValueChanged();
  }

  onAddAdminSubmit() {
    if (this.selectedCompany === '') {
      this.openSnackBar('Please select a company', 'Dismiss');
      return;
    }
    const user = this.addAdminForm.value;
    this.myuserservice.registerAnAdmin(user.username, '123', this.selectedType,
      user.email, 'boro', true)
      .subscribe(result => {
        console.log(result);
        if (this.selectedType === 'airportAdmin') {
          for (const airline of this.airlines) {
            if (this.selectedCompany === airline.name) {
              airline.myuserId = result.retval.id;
              this.airlineservice.updateAttributes(airline.id,
                {myuserId: result.id})
                .subscribe(result1 => {
                this.openSnackBar('Added admin succesfully', 'Dismiss');
              }, err => {
                  this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
                });
              break;
            }
          }
        } else if (this.selectedType === 'hotelAdmin') {
          for (const hotel of this.hotels) {
            if (this.selectedCompany === hotel.name) {
              hotel.myuserId = result.retval.id;
              console.log(hotel);
              this.hotelservice.updateAttributes(hotel.id,
                hotel)
                .subscribe(result1 => {
                  this.openSnackBar('Added admin succesfully', 'Dismiss');
                }, err => {
                  this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
                });
              break;
            }
          }
        } else {
          for (const rac of this.rentalServices) {
            if (this.selectedCompany === rac.name) {
              rac.myuserId = result.retval.id;
              this.rentalserviceservice.updateAttributes(rac.id,
                rac)
                .subscribe(result1 => {
                  this.openSnackBar('Added admin succesfully', 'Dismiss');
                }, err => {
                  this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
                });
              break;
            }
          }
        }
      }, err => {
        this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
      });
  }

  changeCompanies() {
    this.selectedCompany = '';
    this.availableCompanies = [];
    if (this.selectedType === 'airportAdmin'){
      for (const airline of this.airlines) {
        this.availableCompanies.push(airline.name);
      }
    } else if (this.selectedType === 'hotelAdmin') {
      for (const hotel of this.hotels) {
        this.availableCompanies.push(hotel.name);
      }
    } else {
      for (const rac of this.rentalServices) {
        this.availableCompanies.push(rac.name);
      }
    }
  }

  addButton() {
    this.addActive = true;
  }
}
