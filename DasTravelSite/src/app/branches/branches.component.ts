import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { BranchApi } from '../shared/sdk/services';
import { Branch } from '../shared/sdk/models/Branch';
import { RentalServiceApi } from '../shared/sdk/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoopBackConfig, RentalService } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

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
  private branchService: BranchApi,
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
    'name': '',
    'address': ''
  }

  addFormValidationMessages = {
    'serviceName': {
      'required': 'Service name is required'
    },
    'name': {
      'required': 'Name is required'
    },
    'address': {
      'required': 'Address is required'
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
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.addForm.valueChanges
      .subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  onAddSubmit() {
    this.rentalServiceService.findOne({'where': {'name': this.addForm.value.serviceName}})
    .subscribe((rentalservice) => {
      if (rentalservice != null) {
        var myrentalservice = rentalservice as RentalService;
        this.branchService.create({'name': this.addForm.value.name,
          'address': this.addForm.value.address, 'rentalServiceId': myrentalservice.id})
        .subscribe((result) => {
          if (result != null) {
            this.successfullAdd = true;
            setTimeout(() => {this.successfullAdd = null}, 5000);
          }
        });
      }
    }, (err) => {this.failedAdd = true; setTimeout(() => {this.failedAdd = null}, 5000);})
  }

  removeFormErrors = {
    'serviceName': '',
    'name': ''
  }

  removeFormValidationMessages = {
    'serviceName': {
      'required': 'Service name is required'
    },
    'name': {
      'required': 'Name is required'
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
      serviceName: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.removeForm.valueChanges
      .subscribe(data => this.onRemoveValueChanged(data));
    this.onRemoveValueChanged();
  }

  onRemoveSubmit() {
    this.rentalServiceService.findOne({'where': {'name': this.removeForm.value.serviceName}})
      .subscribe((result) => {
        if (result != null) {
          var myrentalservice = result as RentalService;
          this.branchService.findOne({'where': {'name': this.removeForm.value.name,
            'rentalServiceId': myrentalservice.id}})
            .subscribe((branch) => {
              if (branch != null) {
                var mybranch = branch as Branch;
                this.branchService.deleteById(mybranch.id)
                  .subscribe((result) => {
                    this.successfullRemove = true;
                    setTimeout(() => {this.successfullRemove = null; },5000);
                  });
              }
            })
        }
      }, (err) => {
        this.failedRemove = true;
        setTimeout(() => {this.failedRemove = null; },5000);
      });
  }

  changeFormErrors = {
    'serviceName': '',
    'name': '',
    'address': ''
  }

  changeFormValidationMessages = {
    'serviceName': {
      'required': 'Service name is required'
    },
    'name': {
      'required': 'Name is required'
    },
    'address': {
      'required': 'Address is required'
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
      serviceName: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.changeForm.valueChanges
      .subscribe(data => this.onChangeValueChanged(data));
    this.onChangeValueChanged();
  }

  changeGrabBranch() {
    var o1 = this.rentalServiceService.findOne({'where': {'name': this.changeForm.value.serviceName}});
    o1.subscribe(
      (result) => {
        var myrentalservice = result as RentalService;
        var o2 = this.branchService.findOne({'where': {'name': this.changeForm.value.name,
          'rentalServiceId': myrentalservice.id}});
        o2.subscribe(
          (result) => {
            var mybranch = result as Branch;
            this.changeForm.controls['address'].setValue(mybranch.address);
          },
          (err) => {});
      },
      (err) => {});
  }

  onChangeSubmit() {
    var o1 = this.rentalServiceService.findOne({'where': {'name': this.changeForm.value.serviceName}});
    o1.subscribe(
      (result) => {
        var myrentalservice = result as RentalService;
        var o2 = this.branchService.findOne({'where': {'name': this.changeForm.value.name,
          'rentalServiceId': myrentalservice.id}});
        o2.subscribe(
          (result) => {
            var mybranch = result as Branch;
            mybranch.address = this.changeForm.value.address;
            var o3 = this.branchService.updateAttributes(mybranch.id, mybranch);
            o3.subscribe(
              (result) => {
                this.successfullChange = true;
                setTimeout(() => { this.successfullChange = null; }, 5000);
              },
              (err) => {
                this.failedChange = true;
                setTimeout(() => { this.failedChange = null; }, 5000);
              }
            );
          },
          (err) => {
            this.failedChange = true;
            setTimeout(() => { this.failedChange = null; }, 5000);
          }
        );
      },
      (err) => {
        this.failedChange = true;
        setTimeout(() => { this.failedChange = null; }, 5000);
      }
    );
  }

}
