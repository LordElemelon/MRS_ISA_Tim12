import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { RentalServiceApi } from '../shared/sdk/services';
import { RentalService } from '../shared/sdk/models/RentalService';


@Component({
  selector: 'app-rentalservices',
  templateUrl: './rentalservices.component.html',
  styleUrls: ['./rentalservices.component.scss']
})
export class RentalservicesComponent implements OnInit {

  addForm: FormGroup;
  toAddService: RentalService;
  @ViewChild('addform') addFormDirective;

  removeForm: FormGroup;
  @ViewChild('removeform') removeFormDirective;

  changeForm: FormGroup;
  @ViewChild('changeform') changeFormDirective;
  toChangeService: RentalService;

  isAdd: boolean;
  successfullAdd: boolean;

  isRemove: boolean;
  successfullRemove: boolean;

  isChange: boolean;
  successfullChange: boolean;

  constructor(@Inject('baseURL') private baseURL,
    private rentalServiceService: RentalServiceApi,
    private fb: FormBuilder) { 
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
    'name': '',
    'address': '',
    'description': ''
  }

  addFormValidationMessages = {
    'name': {
      'required': 'Name is required'
    },
    'address': {
      'required': 'Address is required'
    },
    'description': {
      'required': 'Description is required'
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
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.addForm.valueChanges
      .subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  onAddSubmit() {
    this.toAddService = this.addForm.value;
    this.rentalServiceService.create(this.toAddService)
    .subscribe((result) => { this.successfullAdd = true;setTimeout(() => this.successfullAdd = null, 5000);/* ukoliko result nije null uspesno je dodavanje */});
    this.addForm.reset({
      name: '',
      address: '',
      description: ''
    });
    this.addFormDirective.resetForm();
  }

  removeFormErrors = {
    'name': ''
  }

  removeFormValidationMessages = {
    'name': {
      'required': 'Name is required in order to remove a rental service'
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
      name: ['', Validators.required]
    });
    this.removeForm.valueChanges
    .subscribe((data) => this.onRemoveValueChanged(data));
    this.onRemoveValueChanged();
  }

  onRemoveSubmit() {
    //{"where":{"name": "string"}}
    this.rentalServiceService.findOne({'where': {'name': this.removeForm.value.name}})
    .subscribe((rentalService) => {
      var myRentalService = rentalService as RentalService
      if (rentalService != null) {
        this.rentalServiceService.deleteById(myRentalService.id)
        .subscribe((deletedRentalService) => {
          if (deletedRentalService != null) {
            this.successfullRemove = true;
            setTimeout(()=> {this.successfullRemove = null;}, 5000)
          }
          this.removeForm.reset({
            name: ''
          });
          this.removeFormDirective.resetForm();
        });
      }
    });
  }

  changeFormErrors = {
    'name': '',
    'address': '',
    'description': ''
  }

  changeFormValidationMessages = {
    'name': {
      'required': 'Name is required in order to change a rental service',
      'non-existent': 'Rental service with this name does not exist'
    },
    'address': {
      'required': 'Address can\'t be empty'
    },
    'description': {
      'required': 'Description can\'t be empty'
    }
  }

  onChangeValueChanged(data?:any) {
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
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.changeForm.valueChanges
    .subscribe((data) => {this.onChangeValueChanged(data)});
    this.onChangeValueChanged();
  }

  changeGrabRental() {
    this.rentalServiceService.findOne({'where': {'name': this.changeForm.value.name}})
    .subscribe((rentalservice) => {
      if (rentalservice != null) {
        var myRentalService = rentalservice as RentalService;
        this.toChangeService = myRentalService;
        this.changeForm.controls['address'].setValue(myRentalService.address);
        this.changeForm.controls['description'].setValue(myRentalService.description);
      }
    }, (err) => {});
  }

  onChangeSubmit() {
    this.rentalServiceService.findOne({'where': {'name': this.changeForm.value.name}})
    .subscribe((rentalservice) => {
      if (rentalservice != null) {
        var myRentalService = rentalservice as RentalService;
        myRentalService.address = this.changeForm.value.address;
        myRentalService.description = this.changeForm.value.description;
        console.log(myRentalService);
        this.rentalServiceService.updateAttributes(myRentalService.id, myRentalService)
         .subscribe((result) => {
           if (result != null) {
              this.successfullChange = true;
              setTimeout(() => {this.successfullChange = null;}, 5000);
           }
         }, (err) => {console.log(err);});
      }
    });
  }

}
