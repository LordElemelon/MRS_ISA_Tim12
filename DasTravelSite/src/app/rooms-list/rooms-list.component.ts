import { Component, OnInit } from '@angular/core';
import { Room } from '../shared/sdk';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  rooms: Room[];


  constructor() {
    this.rooms = [];
    this.rooms.push(new Room());
    this.rooms.push( {  "number": 1,
    "description": 'oki',
    "beds": 2,
    "active": true,
    "id": 'any',
    "hotelId": 'any',
    hotel: null});
   }

  ngOnInit() {
  }

}
