import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { BranchApi } from '../shared/sdk/services';
import { Branch } from '../shared/sdk/models/Branch';
import { RentalServiceApi } from '../shared/sdk/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoopBackConfig, RentalService } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { MatSnackBar } from "@angular/material";
import { ItemService } from '../services/item.service';

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

  isRemove: boolean;

  isChange: boolean;

  isList: boolean;

  constructor(@Inject('baseURL') private baseURL,
  private branchService: BranchApi,
  private fb: FormBuilder,
  private rentalServiceService: RentalServiceApi,
  public snackBar: MatSnackBar,
  private itemService: ItemService) {
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  addFormErrors = {
    'name': '',
    'address': ''
  }

  addFormValidationMessages = {

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
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.addForm.valueChanges
      .subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  onAddSubmit() {
    this.branchService.create({
      'name': this.addForm.value.name,
      'address': this.addForm.value.address,
      'rentalServiceId': this.itemService.getServiceId()})
    .subscribe(
      (result) => {
      if (result != null) {
        this.openSnackBar("Branch added successfully", "Dismiss");
      }
      else {
        this.openSnackBar("Failed to add branch", "Dismiss");
      }
      },
      (err) => {
        this.openSnackBar("Failed to add branch", "Dismiss");
      });
  }

  removeFormErrors = {
    'name': ''
  }

  removeFormValidationMessages = {
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
      name: ['', Validators.required]
    });
    this.removeForm.valueChanges
    .subscribe(data => this.onRemoveValueChanged(data));
    this.onRemoveValueChanged();
  }

  onRemoveSubmit() {

    this.branchService.findOne({
      'where': {
        'name': this.removeForm.value.name,
        'rentalServiceId': this.itemService.getServiceId()
      }
    })
    .subscribe((branch) => {
      var mybranch = branch as Branch;
      this.branchService.deleteById(mybranch.id)
      .subscribe(
      (result) => {
        this.openSnackBar("Branch deleted successfuly", "Dismiss");
      },
      (err) => {
        this.openSnackBar("Failed to delete branch", "Dismiss");
      });
    },
    (err) => {
      this.openSnackBar("This branch does not exist", "Dismiss");
    })

  }

  changeFormErrors = {
    'name': '',
    'address': ''
  }

  changeFormValidationMessages = {
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
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    this.changeForm.valueChanges
    .subscribe(data => this.onChangeValueChanged(data));
    this.onChangeValueChanged();
  }

  changeGrabBranch() {
    var o1 = this.branchService.findOne({'where': {'name': this.changeForm.value.name,
      'rentalServiceId': this.itemService.getServiceId()}});
    o1.subscribe(
    (result) => {
      var mybranch = result as Branch;
      this.changeForm.controls['address'].setValue(mybranch.address);
    },
    (err) => {
      this.openSnackBar("This branch does not exist", "Dismiss");
    });
  }

  onChangeSubmit() {
    var o1 = this.branchService.findOne({'where': {'name': this.changeForm.value.name,
      'rentalServiceId': this.itemService.getServiceId()}});
    o1.subscribe(
      (result) => {
        var mybranch = result as Branch;
        mybranch.address = this.changeForm.value.address;
        var o2 = this.branchService.updateAttributes(mybranch.id, mybranch);
        o2.subscribe(
          (result) => {
            this.openSnackBar("Branch updated successfully", "Dismiss");
          },
          (err) => {
            this.openSnackBar("Failed to update branch", "Dismiss");
          });
      },
      (err) => {
        this.openSnackBar("This branch does not exist", "Dismiss");
      });
  }

}
