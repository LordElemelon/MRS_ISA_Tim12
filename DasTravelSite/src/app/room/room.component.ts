import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room, RoomApi, HotelApi, Hotel, RoomPrice, HotelDiscount } from '../shared/sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomPriceApi, HotelDiscountApi, DiscountOfferApi } from '../shared/sdk/services/custom';
import {MatSnackBar, MatTable} from '@angular/material';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  hotel: Hotel;
  room: Room;
  foundRoom = false;
  addPriceActive = true;
  addDiscountActive = false;
  minDate = new Date();
  selectedOffers: number[] = [];

  columnsToDisplayPrice = ['startDate', 'price', 'action'];
  columnsToDisplayDiscount = ['startDate', 'endDate', 'discount', 'action'];
  columnsToDisplaySpecialOffer = ['name', 'price'];

  addPriceFormErrors = {
    'price': '',
    'startDate': ''
  };

  addPriceFormValidationMessages = {
    'price': {
      'required': 'Price is required',
      'min': 'Price has to be higher than 0'
    },
    'startDate': {
      'required': 'Start date is required',
      'min': 'Start date has to be after today'
    }
  };

  addDiscountFormErrors = {
    'discount': '',
    'startDate': '',
    'endDate': ''
  };

  addDiscountFormValidationMessages = {
    'discount': {
      'required': 'Discount is required',
      'min': 'Discount has to be higher than 0',
      'max': 'Discount has to be less than 101'
    },
    'startDate': {
      'required': 'Start date is required',
      'min': 'Start date has to be after today'
    },
    'endDate': {
      'required': 'End date is required',
      'min': 'End date has to be after today',
      'max': 'End date has to be after start date'
    }
  };

  addPriceForm: FormGroup;
  @ViewChild('fformAddPrice') addPriceFormDirective;

  addDiscountForm: FormGroup;
  @ViewChild('fformAddDiscount') addDiscountFormDirective;

  @ViewChild('tableprices') tablePrices: MatTable<any>;

  @ViewChild('tablediscounts') tableDiscounts: MatTable<any>;

  constructor(
    private router: ActivatedRoute,
    private roomservice: RoomApi,
    private roompriceservice: RoomPriceApi,
    private roomdiscountservice: HotelDiscountApi,
    private hotelservice: HotelApi,
    private discountofferservice: DiscountOfferApi,
    public snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.createAddPriceForm();
    this.createAddDiscountForm();
   }

  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.roomservice.findById(id, {include: ['roomPrices', 'hotelDiscounts']})
    .subscribe((result: Room) =>  {
      this.room = result;
      this.foundRoom = true;
    });
    this.hotelservice.findOne({'where': {'name' : 'hotel1'}, include: 'hotelSpecialOffers'})
      .subscribe((hotel: Hotel) => {
        this.hotel = hotel;
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onAddPriceFormValueChanged(data?: any)  {
    if (!this.addPriceForm) {return; }
    const form = this.addPriceForm;
    for (const field in this.addPriceFormErrors) {
      if (this.addPriceFormErrors.hasOwnProperty(field)) {
        this.addPriceFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addPriceFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.addPriceFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
    const startDate = form.get('startDate').value;
    startDate.setHours(23, 59, 59);
    if (startDate <= this.minDate) {
      this.addPriceFormErrors['startDate'] += this.addPriceFormValidationMessages['startDate']['min'] + ' ';
      this.addPriceForm.controls['startDate'].setErrors({'min' : true});
    }
  }

  createAddPriceForm() {
    this.addPriceForm = this.fb.group({
      price : [0, [Validators.required, Validators.min(1)]],
      startDate: [new Date, [Validators.required]]
    });
    this.addPriceForm.valueChanges
      .subscribe(data => this.onAddPriceFormValueChanged(data));
    this.onAddPriceFormValueChanged();
  }

  onAddPriceSubmit() {
    const price = this.addPriceForm.value;
    const d = new Date(price.startDate);
    d.setHours(8);
    this.roompriceservice.create({
      'price': price.price,
      'startDate': d,
      'hotelId': this.hotel.id,
      'roomId': this.room.id
    }).subscribe((result: RoomPrice) =>  {
      this.room.roomPrices.push(result);
      this.tablePrices.renderRows();
      this.openSnackBar('Added succesfully', 'Dismiss');
    }, err =>  {
      this.openSnackBar('Can not add price', 'Dismiss');
    });
  }

  onAddDiscountFormValueChanged(data?: any)  {
    if (!this.addDiscountForm) {return; }
    const form = this.addDiscountForm;
    for (const field in this.addDiscountFormErrors) {
      if (this.addDiscountFormErrors.hasOwnProperty(field)) {
        this.addDiscountFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addDiscountFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.addDiscountFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
    const startDate = form.get('startDate').value;
    startDate.setHours(23, 59, 59);
    if (startDate <= this.minDate) {
      this.addDiscountFormErrors['startDate'] += this.addDiscountFormValidationMessages['startDate']['min'] + ' ';
      this.addDiscountForm.controls['startDate'].setErrors({'min' : true});
    }
    const endDate = form.get('endDate').value;
    endDate.setHours(23, 59, 59);
    if (endDate <= this.minDate) {
      this.addDiscountFormErrors['endDate'] += this.addDiscountFormValidationMessages['endDate']['min'] + ' ';
      this.addDiscountForm.controls['endDate'].setErrors({'min' : true});
    }
    if (endDate <= startDate)  {
      this.addDiscountFormErrors['endDate'] += this.addDiscountFormValidationMessages['endDate']['max'] + ' ';
      this.addDiscountForm.controls['endDate'].setErrors({'max' : true});
    }
  }

  createAddDiscountForm() {
    this.addDiscountForm = this.fb.group({
      discount : [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      startDate: [new Date, [Validators.required]],
      endDate: [new Date(), [Validators.required]]
    });
    this.addDiscountForm.valueChanges
      .subscribe(data => this.onAddDiscountFormValueChanged(data));
    this.onAddDiscountFormValueChanged();
  }

  onAddDiscountSubmit() {
    const discount = this.addDiscountForm.value;
    const d = new Date(discount.startDate);
    const d2 = new Date(discount.endDate);
    this.roomdiscountservice.create({
      'discount': discount.discount,
      'startDate': d,
      'endDate': d2,
      'hotelId': this.hotel.id,
      'roomId': this.room.id
    }).subscribe((result: HotelDiscount) =>  {
      console.log(this.room.hotelDiscounts);
      this.room.hotelDiscounts.push(result);
      console.log(this.room.hotelDiscounts);
      this.tableDiscounts.renderRows();
      this.selectedOffers.forEach(offerId => {
        this.discountofferservice.create({
          'hotelDiscountId': result.id,
          'hotelSpecialOfferId': offerId
        }).subscribe(result1 =>  {
          console.log(result1);
        });
      });
      this.openSnackBar('Added succesfully', 'Dismiss');
    }, err =>  {
      this.openSnackBar('Can not add discount', 'Dismiss');
    });
  }

  toggleRow(id: number) {
    const index = this.selectedOffers.indexOf(id);
    if (index >= 0)  {
      this.selectedOffers.splice(index, 1);
    } else  {
      this.selectedOffers.push(id);
    }
    console.log(this.selectedOffers);
  }

  addPriceButton()  {
    this.addPriceActive = true;
    this.addDiscountActive = false;
  }

  addDiscountButton()  {
    this.addPriceActive = false;
    this.addDiscountActive  = true;
  }

}
