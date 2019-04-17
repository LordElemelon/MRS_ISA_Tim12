import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room, RoomApi, HotelApi, Hotel } from '../shared/sdk';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RoomPriceApi } from '../shared/sdk/services/custom/RoomPrice';
import { HotelDiscountApi } from '../shared/sdk/services/custom/HotelDiscount';

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

  addPriceForm: FormGroup
  @ViewChild('fformAddPrice') addPriceFormDirective;

  addDiscountForm: FormGroup
  @ViewChild('fformAddDiscount') addDiscountFormDirective;

  constructor(
    private router: ActivatedRoute,
    private roomservice: RoomApi,
    private roompriceservice: RoomPriceApi,
    private roomdiscountservice: HotelDiscountApi,
    private hotelservice: HotelApi,
    private fb: FormBuilder
  ) {
    this.createAddPriceForm();
    this.createAddDiscountForm();
   }

  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.roomservice.findById(id)
    .subscribe((result: Room) =>{
      this.room = result;
      this.foundRoom = true;

    });
    this.hotelservice.findOne({'where': {'name' : 'hotel1'}})
      .subscribe((hotel: Hotel) => {
        this.hotel = hotel;
      });
  }

  createAddPriceForm() {
    this.addPriceForm = this.fb.group({
      price : '',
      startDate: ''
    });
  }

  createAddDiscountForm() {
    this.addDiscountForm = this.fb.group({
      discount : 0,
      startDate: '',
      endDate: ''
    });
  }

  onAddPriceSubmit() {
    const price = this.addPriceForm.value;
    const d = new Date(price.startDate);
    this.roompriceservice.create({
      'price': price.price,
      'startDate': d.toISOString(),
      'hotelId': this.hotel.id,
      'roomId': this.room.id
    }).subscribe(result =>{
      console.log(result);
    });
  }

  onAddDiscountSubmit() {
    console.log('evo me');
    const discount = this.addDiscountForm.value;
    console.log(discount.discount);
    const d = new Date(discount.startDate);
    const d2 = new Date(discount.endDate);
    this.roomdiscountservice.create({
      'discount': discount.discount,
      'startDate': d.toISOString(),
      'endDate': d2.toISOString(),
      'hotelId': this.hotel.id,
      'roomId': this.room.id
    }).subscribe(result =>{
      console.log(result);
    });
  }

  addPriceButton(){
    this.addPriceActive = true;
    this.addDiscountActive = false;
  }

  addDiscountButton(){
    this.addPriceActive = false;
    this.addDiscountActive  = true;
  }

}
