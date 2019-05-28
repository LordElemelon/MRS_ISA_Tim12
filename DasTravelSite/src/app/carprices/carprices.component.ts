import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { RentalServiceApi, LoopBackConfig, RentalService } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { CarPriceApi } from '../shared/sdk';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-carprices',
  templateUrl: './carprices.component.html',
  styleUrls: ['./carprices.component.scss']
})
export class CarpricesComponent implements OnInit {

  isAdd: boolean;

  addForm: FormGroup;
  @ViewChild('addform') addFormDirective;

  setToAdd() {
    this.isAdd = true;
  }
  
  constructor(
    @Inject('baseURL') private baseURL,
    private fb: FormBuilder,
    private rentalServiceService: RentalServiceApi,
    private carPriceService: CarPriceApi,
    public snackBar: MatSnackBar,
    private itemService: ItemService) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createAddForm();
   }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  addFormErrors = {
    'start': '',
    'priceA': '',
    'priceB': '',
    'priceC': '' 
  }

  addFormValidationMessages = {
    'start': {
      'required': 'Start date is required'
    },
    'priceA': {
      'required': 'Price for category A is required',
      'pattern': 'Price has to be a number'
    },
    'priceB': {
      'required': 'Price for category B is required',
      'pattern': 'Price has to be a number'
    },
    'priceC': {
      'required': 'Price for category C is required',
      'pattern': 'Price has to be a number'
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
      start: ['', Validators.required],
      priceA: [0, [Validators.required, Validators.pattern]],
      priceB: [0, [Validators.required, Validators.pattern]],
      priceC: [0, [Validators.required, Validators.pattern]]
    });
    this.addForm.valueChanges.subscribe(
      (data) => this.onAddValueChanged(data)
    )
    this.onAddValueChanged();
  }

  onAddSubmit() {
    var searchObj = {
      start: this.addForm.value.start,
      rentalServiceId: this.itemService.getServiceId(),
      catAPrice: Number(this.addForm.value.priceA),
      catBPrice: Number(this.addForm.value.priceB),
      catCPrice: Number(this.addForm.value.priceC)
    }
    this.carPriceService.create(searchObj)
    .subscribe(
      (result) => {
        this.openSnackBar("Successfully added price menu.", "Dismiss");
      },
      (err) => {
        this.openSnackBar("Failed to add price menu.", "Dismiss");
      }
    )    
  }


}
