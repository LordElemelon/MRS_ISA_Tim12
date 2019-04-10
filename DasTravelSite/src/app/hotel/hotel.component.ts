import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { LoopBackConfig } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { HotelApi, RoomApi } from '../shared/sdk/services';
import { Hotel, Room } from '../shared/sdk/models/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  // form related objects
  modifyHotelForm: FormGroup;
  modifiedHotel: Hotel;
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
    'beds': ''
  };

  addRoomFormValidationMessages = {
    'number': {
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
    },
    'beds': {
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
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
      'required': 'Number of room is required',
      'min': 'Number of room must be higher than 0'
    }
  };

  constructor(@Inject('baseURL') private baseURL,
    private hotelservice: HotelApi,
    private roomservice: RoomApi,
    private fb: FormBuilder
    ) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createModifyHotelForm();
      this.createAddRoomForm();
      this.createRemoveRoomForm();
      this.createGetRoomForm();
      this.createModifyRoomForm();
   }

  ngOnInit() {
    this.hotelservice.findOne({'where': {'name' : 'hotel1'}})
    .subscribe((hotel: Hotel) => {
      this.modifiedHotel = hotel;
      this.setValueModifyHotelForm();
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
      'name': this.modifiedHotel.name,
      'address' : this.modifiedHotel.address,
      'description' : this.modifiedHotel.description,
      'id' : this.modifiedHotel.id
    });
  }

  onModifyHotelSubmit() {
    this.modifiedHotel = this.modifyHotelForm.value;
    this.hotelservice.updateAttributes(this.modifiedHotel.id, this.modifiedHotel)
    .subscribe(result => {});
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
      'description': '',
      'hotelId': ''
    });
    this.addRoomForm.valueChanges
    .subscribe(data => this.onValueChangedAddRoom(data));
    this.onValueChangedAddRoom();
  }

  onAddRoomSubmit() {
    this.newRoom = this.addRoomForm.value;
    this.hotelservice.createRooms(this.modifiedHotel.id, this.newRoom)
    .subscribe(result => {});
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
    this.hotelservice.getRooms(this.modifiedHotel.id, {where : {number: this.toRemoveRoomNumber}})
    .subscribe(result => {
      console.log(result);
      this.hotelservice.destroyByIdRooms(this.modifiedHotel.id, result[0].id)
      .subscribe(result => {console.log(result);});
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
    this.hotelservice.getRooms(this.modifiedHotel.id, {where : {number: this.toGetRoomNumber}})
    .subscribe(result => {
      this.modifiedRoom = result[0];
      this.setValueModifyRoomForm();
    });
  }

  onValueChangedModifyRoom(data?: any) {
    if (!this.modifyRoomForm) {return; }
    const form = this.modifyRoomForm;
    for (const field in this.modifyRoomFormErrors){
      if (this.modifyRoomFormErrors.hasOwnProperty(field)){
        this.modifyRoomFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.modifyRoomFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
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
    console.log(this.modifiedRoom);
    this.roomservice.updateAttributes(this.modifiedRoom.id, this.modifiedRoom)
    .subscribe(result => {
      console.log(result);
    })
  }

  modifyButton(){
    this.modifyActive = true;
    this.addRoomActive = false;
    this.removeRoomActive = false;
    this.modifyRoomActive = false;
  }

  addRoomButton(){
    this.modifyActive = false;
    this.addRoomActive = true;
    this.removeRoomActive = false;
    this.modifyRoomActive = false;
  }

  removeRoomButton(){
    this.modifyActive = false;
    this.addRoomActive = false;
    this.removeRoomActive = true;
    this.modifyRoomActive = false;
  }

  modifyRoomButton(){
    this.modifyActive = false;
    this.addRoomActive = false;
    this.removeRoomActive = false;
    this.modifyRoomActive = true;
  }
}
