import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LoopBackConfig, RentalService } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { CarApi, RentalServiceApi } from '../shared/sdk/services';
import { Car } from '../shared/sdk/models/Car';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  foundCars: Car[];

  addForm: FormGroup;
  @ViewChild('addform') addFormDirective;

  removeForm: FormGroup;
  @ViewChild('removeform') removeFormDirective;


  changeForm: FormGroup;
  @ViewChild('changeform') changeFormDirective;

  isAdd: boolean;
  successfullAdd: boolean;
  failedAdd: boolean;

  isRemove: boolean;
  successfullRemove: boolean;
  failedRemove: boolean;

  isChange: boolean;
  successfullChange: boolean;
  failedChange: boolean;

  constructor(@Inject('baseURL') private baseURL,
    private carservice: CarApi,
    private fb: FormBuilder,
    private rentalServiceService: RentalServiceApi) { 
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createAddForm();
      this.createRemoveForm();
      this.createChangeForm();  
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
    'serviceName': '',
    'registration': '',
    'make': '',
    'seats': '' 
  }

  addFormValidationMessages = {
    'serviceName': {
      'required': 'Service name is required'
    },
    'registration': {
      'required': 'Registration is required'
    },
    'make': {
      'required': 'Make is required'
    },
    'seats': {
      'required': 'Seats are required',
      'pattern': 'Seats have to be a number'
    }
  }

  onAddValueChanged(data?:any) {
    if (!this.addForm) { return; }
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
      serviceName: ['', Validators.required],
      registration: ['', Validators.required],
      make: ['', Validators.required],
      seats: [0, [Validators.required, Validators.pattern]]
    });
    this.addForm.valueChanges
      .subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  onAddSubmit() {
    var o1 = this.rentalServiceService.findOne({'where': {'name': this.addForm.value.serviceName}});
    o1.subscribe(
      (result) => {
        var myrentalservice = result as RentalService;
        var o2 = this.carservice.create({
          'make': this.addForm.value.make,
          'registration': this.addForm.value.registration,
          'seats': this.addForm.value.seats,
          'rentalServiceId': myrentalservice.id
        });
        o2.subscribe(
          (result) => {
            this.successfullAdd = true;
            setTimeout(() => {this.successfullAdd = null}, 5000);
          },
          (err) => {
            this.failedAdd = true;
            setTimeout(() => { this.failedAdd = null; }, 5000);
          }
        )
      },
      (err) => {
        this.failedAdd = true;
        setTimeout(() => { this.failedAdd = null; }, 5000);
      }
    )
  }

  removeFormErrors = {
    'registration': ''
  }

  removeFormValidationMessages = {
    'registration': {
      'required': 'Registration is required'
    }
  }

  onRemoveValueChanged(data?:any) {
    if (!this.removeForm) { return; }
    const form = this.removeForm;
    for (const field in this.removeFormErrors) {
      if (this.removeFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.removeFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.removeFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.removeFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createRemoveForm() {
    this.removeForm = this.fb.group({
      registration: ['', Validators.required]
    });
    this.removeForm.valueChanges
      .subscribe((data) => this.onRemoveValueChanged(data));
    this.onRemoveValueChanged();
  }

  onRemoveSubmit() {
    var o1 = this.carservice.findOne({'where': {'registration' : this.removeForm.value.registration}});
    o1.subscribe(
      (result) => {
        var mycar = result as Car;
        var o2 = this.carservice.deleteById(mycar.id);
        o2.subscribe(
          (result) => {
            this.successfullRemove = true;
            setTimeout(() => {this.successfullRemove = null;}, 5000);
          },
          (err) => {
            this.failedRemove = true;
            setTimeout(() => {this.failedRemove = null;}, 5000);
          }
        )
      },
      (err) => {
        this.failedRemove = true;
        setTimeout(() => {this.failedRemove = null;}, 5000);
      }
    )
  }

  changeFormErrors = {
    'serviceName': '',
    'registration': '',
    'make': '',
    'seats': '' 
  }

  changeFormValidationMessages = {
    'serviceName': {
      'required': 'Service name is required'
    },
    'registration': {
      'required': 'Registration is required'
    },
    'make': {
      'required': 'Make is required'
    },
    'seats': {
      'required': 'Seats are required',
      'pattern': 'Seats have to be a number'
    }
  }

  onChangeValueChanged(data?: any) {
    if (!this.changeForm) { return; }
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

  createChangeForm() {
    this.changeForm = this.fb.group({
      registration: ['', Validators.required],
      make: ['', Validators.required],
      seats: [0, [Validators.required, Validators.pattern]]
    });
    this.changeForm.valueChanges
      .subscribe(data => this.onChangeValueChanged(data));
    this.onChangeValueChanged();
  }

  onChangeSubmit() {
    var o1 = this.carservice.findOne({'where': {'registration': this.changeForm.value.registration}});
    o1.subscribe(
      (result) => {
        var mycar = result as Car;
        mycar.seats = this.changeForm.value.seats;
        mycar.make = this.changeForm.value.make;
        var o2 = this.carservice.updateAttributes(mycar.id, mycar);
        o2.subscribe(
          (result) => {
            this.successfullChange = true;
            setTimeout(() => {this.successfullChange = null;}, 5000);
          },
          (err) => {
            this.failedChange = true;
            setTimeout(() => {this.failedChange = null;}, 5000);
          }
        );
      },
      (err) => {
        this.failedChange = true;
        setTimeout(() => {this.failedChange = null;}, 5000);
      }
    );
  }

  changeGrabCar() {
    var o1 = this.carservice.findOne({'where': {'registration': this.changeForm.value.registration}});
    o1.subscribe(
      (result) => {
        var mycar = result as Car;
        this.changeForm.controls['make'].setValue(mycar.make);
        this.changeForm.controls['seats'].setValue(mycar.seats);
      },
      (err) => {
        this.changeForm.controls['make'].setValue('');
        this.changeForm.controls['seats'].setValue('');
      }
    );
  }





}
