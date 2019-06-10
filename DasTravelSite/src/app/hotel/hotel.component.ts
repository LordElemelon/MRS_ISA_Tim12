import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {HotelSpecialOfferApi, LoopBackConfig} from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { HotelApi, RoomApi } from '../shared/sdk/services';
import { Hotel, Room, HotelSpecialOffer } from '../shared/sdk/models/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar, MatTable} from '@angular/material';
import {LoginServiceService} from '../login-service.service';
import {ItemService} from '../services/item.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {

  modifyActive = true;
  addRoomActive = false;
  removeRoomActive = false;
  modifyRoomActive = false;
  addSpecialOfferActive = false;
  userType: string;
  columnsToDisplaySpecialOffers = ['name', 'price'];
  // form related objects
  modifyHotelForm: FormGroup;
  myHotel: Hotel;
  @ViewChild('fformModifyHotel') modifyHotelFormDirective;

  addRoomForm: FormGroup;
  newRoom: Room;
  @ViewChild('fformAddRoom') addRoomFormDirective;

  removeRoomForm: FormGroup;
  toRemoveRoomNumber: number;
  @ViewChild('fformRemoveRoom') removeRoomFormDirective;

  getRoomForm: FormGroup;
  toGetRoomNumber: number;
  @ViewChild('fformGetRoom') getRoomFormDirective;

  modifyRoomForm: FormGroup;
  modifiedRoom: Room;
  @ViewChild('fformModifyRoom') modifyRoomFormDirective;

  addSpecialOfferForm: FormGroup;
  @ViewChild('fformAddSpecialOffer') addSpecialOfferFormDirective;

  @ViewChild('tablespecialoffers') tableSpecialOffers: MatTable<any>;

  modifyHotelFormErrors = {
    'name': '',
    'address': ''
  };

  modifyHotelFormValidationMessages = {
    'name': {
      'required' : 'Hotel name is required'
    },
    'address': {
      'required' : 'Hotel address is required'
    }
  };

  addRoomFormErrors = {
    'number': '',
    'beds': '',
    'description': ''
  };

  addRoomFormValidationMessages = {
    'number': {
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
    },
    'beds': {
      'required': 'Number of beds is required',
      'min': 'Number of beds must be higher than 0'
    },
    'description':
      {
        'required': 'Description is required'
      }
  };

  removeRoomFormErrors = {
    'number': ''
  };

  removeRoomFormValidationMessages = {
    'number': {
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
    }
  };

  getRoomFormErrors = {
    'number': ''
  };

  getRoomFormValidationMessages = {
    'number': {
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
    }
  };

  modifyRoomFormErrors = {
    'number': '',
    'beds': ''
  };

  modifyRoomFormValidationMessages = {
    'number': {
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
    },
    'beds': {
      'required': 'Number of beds is required',
      'min': 'Number of beds must be higher than 0'
    }
  };

  addSpecialOfferFormErrors = {
    'name': '',
    'price': ''
  };

  addSpecialOfferFormValidationMessages = {
    'name': {
      'required': 'Name is required'
    },
    'price': {
      'required': 'Price is required',
      'min': 'Price must be higher than 0'
    }
  };

  constructor(@Inject('baseURL') private baseURL,
    private hotelservice: HotelApi,
    private roomservice: RoomApi,
    private specialofferservice: HotelSpecialOfferApi,
    public snackBar: MatSnackBar,
    private loginService: LoginServiceService,
    private itemservice: ItemService,
    private fb: FormBuilder
    ) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createModifyHotelForm();
      this.createAddRoomForm();
      this.createRemoveRoomForm();
      this.createGetRoomForm();
      this.createModifyRoomForm();
      this.createAddSpecialOfferForm();
      loginService.user.subscribe(data => {
        if (data) {
          this.userType = data.user.type;
        }
      });
   }

  ngOnInit() {
    this.hotelservice.findOne({'where': {'id' : this.itemservice.getHotelId()}, 'include': 'hotelSpecialOffers'})
    .subscribe((hotel: Hotel) => {
      this.myHotel = hotel;
      this.setValueModifyHotelForm();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onValueChangedModifyHotel(data?: any) {
    if (!this.modifyHotelForm) {return; }
    const form = this.modifyHotelForm;
    for (const field in this.modifyHotelFormErrors){
      if (this.modifyHotelFormErrors.hasOwnProperty(field)){
        this.modifyHotelFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifyHotelFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.modifyHotelFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createModifyHotelForm() {
    this.modifyHotelForm = this.fb.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required],
      'description': '',
      'id' : ''
    });

    this.modifyHotelForm.valueChanges
      .subscribe(data => this.onValueChangedModifyHotel(data));
    this.onValueChangedModifyHotel();
  }

  setValueModifyHotelForm() {
    this.modifyHotelForm.setValue({
      'name': this.myHotel.name,
      'address' : this.myHotel.address,
      'description' : this.myHotel.description,
      'id' : this.myHotel.id
    });
  }

  onModifyHotelSubmit() {
    this.myHotel.address = this.modifyHotelForm.value.address;
    this.myHotel.name = this.modifyHotelForm.value.name;
    this.myHotel.description = this.modifyHotelForm.value.description;
    this.hotelservice.updateAttributes(this.myHotel.id, this.myHotel)
    .subscribe(result => {
      this.openSnackBar('Modified hotel succesfully', 'Dismiss');
    }, err => {
      this.openSnackBar('Can not modify the hotel. Check if the new name is already taken', 'Dismiss');
    });
  }

  onValueChangedAddRoom(data?: any) {
    if (!this.addRoomForm) {return; }
    const form = this.addRoomForm;
    for (const field in this.addRoomFormErrors){
      if (this.addRoomFormErrors.hasOwnProperty(field)){
        this.addRoomFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addRoomFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.addRoomFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddRoomForm() {
    this.addRoomForm = this.fb.group({
      'number': [0, [Validators.required, Validators.min(1)]],
      'beds': [0, [Validators.required, Validators.min(1)]],
      'description': ['', [Validators.required]],
      'hotelId': ''
    });
    this.addRoomForm.valueChanges
    .subscribe(data => this.onValueChangedAddRoom(data));
    this.onValueChangedAddRoom();
  }

  onAddRoomSubmit() {
    this.newRoom = this.addRoomForm.value;
    this.newRoom.hotelId = this.myHotel.id;
    this.roomservice.create(this.newRoom)
    .subscribe(result => {
      this.openSnackBar('Added a room succesfully', 'Dismiss');
    }, err => {
      this.openSnackBar('Can not add that room. Check if the room number is already taken.', 'Dismiss');
    });
  }

  onValueChangedRemoveRoom(data?: any) {
    if (!this.removeRoomForm) {return; }
    const form = this.removeRoomForm;
    for (const field in this.removeRoomFormErrors){
      if (this.removeRoomFormErrors.hasOwnProperty(field)){
        this.removeRoomFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.removeRoomFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.removeRoomFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createRemoveRoomForm() {
    this.removeRoomForm = this.fb.group({
      'number': [0, [Validators.required, Validators.min(1)]],
    });
    this.removeRoomForm.valueChanges
    .subscribe(data => this.onValueChangedRemoveRoom(data));
    this.onValueChangedRemoveRoom();
  }

  onRemoveRoomSubmit() {
    this.toRemoveRoomNumber = this.removeRoomForm.value.number;
    this.hotelservice.getRooms(this.myHotel.id, {where : {number: this.toRemoveRoomNumber}})
    .subscribe(result => {
      if (result.length !== 0)  {
        this.roomservice.deleteById(result[0].id)
          .subscribe(result1 => {
            this.openSnackBar('Removed succesfully', 'Dismiss');
          }, err => {
            this.openSnackBar('Can not remove the room. It either does not exist or has a reservation in the future', 'Dismiss');
          });
      } else  {
        this.openSnackBar('Can not remove the room. It either does not exist or has a reservation in the future', 'Dismiss');
      }
    }, err => {
      this.openSnackBar('Can not remove the room. It either does not exist or has a reservation in the future', 'Dismiss');
    });
  }

  onValueChangedGetRoom(data?: any) {
    if (!this.getRoomForm) {return; }
    const form = this.getRoomForm;
    for (const field in this.getRoomFormErrors){
      if (this.getRoomFormErrors.hasOwnProperty(field)){
        this.getRoomFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.getRoomFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.getRoomFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createGetRoomForm() {
    this.getRoomForm = this.fb.group({
      'number': [0, [Validators.required, Validators.min(1)]],
    });
    this.getRoomForm.valueChanges
    .subscribe(data => this.onValueChangedGetRoom(data));
    this.onValueChangedGetRoom();
  }

  onGetRoomSubmit() {
    this.toGetRoomNumber = this.getRoomForm.value.number;
    this.hotelservice.getRooms(this.myHotel.id, {where : {number: this.toGetRoomNumber}})
    .subscribe(result => {
      if (result.length !== 0) {
        this.modifiedRoom = result[0];
        this.setValueModifyRoomForm();
      }
    });
  }

  onValueChangedModifyRoom(data?: any) {
    if (!this.modifyRoomForm) {return; }
    const form = this.modifyRoomForm;
    for (const field in this.modifyRoomFormErrors)  {
      if (this.modifyRoomFormErrors.hasOwnProperty(field))  {
        this.modifyRoomFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifyRoomFormValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.modifyRoomFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createModifyRoomForm() {
    this.modifyRoomForm = this.fb.group({
      'number': [0, [Validators.required, Validators.min(1)]],
      'beds': [0, [Validators.required, Validators.min(1)]],
      'description': '',
      'hotelId': '',
      'id': ''
    });
    this.modifyRoomForm.valueChanges
    .subscribe(data => this.onValueChangedModifyRoom(data));
    this.onValueChangedModifyRoom();
  }

  setValueModifyRoomForm() {
    this.modifyRoomForm.setValue({
      'number': this.modifiedRoom.number,
      'beds' : this.modifiedRoom.beds,
      'description' : this.modifiedRoom.description,
      'hotelId': this.modifiedRoom.hotelId,
      'id': this.modifiedRoom.id
    });
  }

  onModifyRoomSubmit() {
    this.modifiedRoom = this.modifyRoomForm.value;
    this.roomservice.updateAttributes(this.modifiedRoom.id, this.modifiedRoom)
    .subscribe(result => {
      this.openSnackBar('Modified room succesfully', 'Dismiss');
    }, err => {
      this.openSnackBar('Can not modify the room. Check if the new room number is taken', 'Dismiss');
    });
  }

  onValueChangedAddSpecialOffer(data?: any) {
    if (!this.addSpecialOfferForm) {return; }
    const form = this.addSpecialOfferForm;
    //  const errors = this.addSpecialOfferFormErrors;
    for (const field in this.addSpecialOfferFormErrors)  {
      if (this.addSpecialOfferFormErrors.hasOwnProperty(field))  {
        this.addSpecialOfferFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addSpecialOfferFormValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.addSpecialOfferFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddSpecialOfferForm() {
    this.addSpecialOfferForm = this.fb.group({
      'name': ['', [Validators.required]],
      'price': [0, [Validators.required, Validators.min(1)]]
    });
    this.addSpecialOfferForm.valueChanges
      .subscribe(data => this.onValueChangedAddSpecialOffer(data));
    this.onValueChangedAddSpecialOffer();
  }

  onAddSpecialOfferSubmit()  {
    const specialOffer = this.addSpecialOfferForm.value;
    this.specialofferservice.create({
      'name': specialOffer.name,
      'price' : specialOffer.price,
      'hotelId' : this.myHotel.id
    }).subscribe((result: HotelSpecialOffer) => {
      this.myHotel.hotelSpecialOffers.push(result);
      this.tableSpecialOffers.renderRows();
      this.openSnackBar('Created a special offer succesfully', 'Dismiss');;
    }, err => {
      this.openSnackBar('Can not add this special offer. Check if an offer with that name already exists', 'Dismiss');
    });
  }

  modifyButton() {
    this.modifyActive = true;
    this.addRoomActive = false;
    this.removeRoomActive = false;
    this.modifyRoomActive = false;
    this.addSpecialOfferActive = false;
  }

  addRoomButton() {
    this.modifyActive = false;
    this.addRoomActive = true;
    this.removeRoomActive = false;
    this.modifyRoomActive = false;
    this.addSpecialOfferActive = false;
  }

  removeRoomButton() {
    this.modifyActive = false;
    this.addRoomActive = false;
    this.removeRoomActive = true;
    this.modifyRoomActive = false;
    this.addSpecialOfferActive = false;
  }

  modifyRoomButton() {
    this.modifyActive = false;
    this.addRoomActive = false;
    this.removeRoomActive = false;
    this.modifyRoomActive = true;
    this.addSpecialOfferActive = false;
  }

  addSpecialOfferButton() {
    this.modifyActive = false;
    this.addRoomActive = false;
    this.removeRoomActive = false;
    this.modifyRoomActive = false;
    this.addSpecialOfferActive = true;
  }
}
