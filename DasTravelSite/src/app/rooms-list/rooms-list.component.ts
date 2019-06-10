import { Component, OnInit, Inject } from '@angular/core';
import { Room, HotelApi } from '../shared/sdk';
import { Hotel } from '../shared/sdk/models/';
import {ItemService} from '../services/item.service';
@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  rooms: Room[];
  hotel: Hotel;

  constructor(@Inject('baseURL') private baseURL,
              private hotelservice: HotelApi,
              private itemservice: ItemService) {

   }

  ngOnInit() {
    this.hotelservice.findOne({'where': {'id' : this.itemservice.getHotelId()}})
    .subscribe((hotel: Hotel) => {
      this.hotel = hotel;
      this.hotelservice.getRooms(this.hotel.id)
      .subscribe((result: Room[]) => {
        this.rooms = result;
      });
    });
  }

}
