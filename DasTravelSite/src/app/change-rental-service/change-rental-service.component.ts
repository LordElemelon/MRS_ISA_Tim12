import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RentalServiceApi, LoopBackConfig } from '../shared/sdk';
import { LoginServiceService } from '../login-service.service';
import { MatSnackBar } from '@angular/material';
import { API_VERSION } from '../shared/baseUrl';
import { ItemService } from '../services/item.service';
import { RentalService } from '../shared/sdk/models';

@Component({
  selector: 'app-change-rental-service',
  templateUrl: './change-rental-service.component.html',
  styleUrls: ['./change-rental-service.component.scss']
})
export class ChangeRentalServiceComponent implements OnInit {


  userType: string;
  changeForm: FormGroup;

  @ViewChild('changeform') changeFormDirective;

  constructor(@Inject('baseURL') private baseURL,
    private rentalServiceService: RentalServiceApi,
    private loginService: LoginServiceService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private itemService: ItemService) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createChangeForm();
      var temp = this.itemService.getServiceId()
      console.log(temp);
      this.rentalServiceService.findById(this.itemService.getServiceId())
      .subscribe(
        (result: any) => {
          this.changeForm.controls['name'].setValue(result.name);
          this.changeForm.controls['address'].setValue(result.address);
          this.changeForm.controls['description'].setValue(result.description);
        },
        (err) => {

      })
     }

     openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
         duration: 2000,
      });
    }
    

  ngOnInit() {
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

  onChangeSubmit() {

    this.rentalServiceService.findById(this.itemService.getServiceId())
    .subscribe(
      (rentalservice) => {
        var myRentalService = rentalservice as RentalService;
        myRentalService.address = this.changeForm.value.address;
        myRentalService.description = this.changeForm.value.description;
        this.rentalServiceService.updateAttributes(myRentalService.id, myRentalService)
         .subscribe(
          (result) => {
            if (result != null) {
              this.openSnackBar("Change successfull", "Dismiss");
            }
            else {
              this.openSnackBar("Change failed", "Dismiss");
            }
          },
          (err) => {
            this.openSnackBar("Change failed", "Dismiss");
          });
      },
      (err) => {
        this.baseURL.openSnackBar("Failed to retrieve rental service", "Dismiss");
      }
    )
        
      
    
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

}
