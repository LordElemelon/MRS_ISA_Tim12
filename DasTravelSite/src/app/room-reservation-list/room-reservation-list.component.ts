import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Room, RoomReservation} from '../shared/sdk/models';
import {HotelApi, MyuserApi, RoomApi} from '../shared/sdk/services/custom';
import {MatSnackBar, MatTable} from '@angular/material';

@Component({
  selector: 'app-room-reservation-list',
  templateUrl: './room-reservation-list.component.html',
  styleUrls: ['./room-reservation-list.component.scss']
})
export class RoomReservationListComponent implements OnInit {
  roomReservations: RoomReservation[];
  reservationsInfo = [];

  columnsToDisplayReservations = ['hotel', 'roomNumber', 'beds', 'startDate', 'endDate', 'price', 'action'];

  @ViewChild('tablereservations') tableReservations: MatTable<any>;
  constructor(@Inject('baseURL') private baseURL,
              private myuserservice: MyuserApi,
              private hotelservice: HotelApi,
              private roomservice: RoomApi,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit() {
    if (this.myuserservice.getCachedCurrent()) {
      this.myuserservice.getRoomReservations(this.myuserservice.getCachedCurrent())
        .subscribe(result => {
          this.roomReservations = result.retval;
          const done = new Promise((resolve, reject) => {
            let index = 0;
            for (const roomReservation of this.roomReservations) {
              const idLen = roomReservation.roomId.length;
              this.roomservice.findById(roomReservation.roomId.substring(1, idLen - 1))
                .subscribe((room: Room) => {
                  this.hotelservice.findById(room.hotelId)
                    .subscribe((hotel) => {
                        this.reservationsInfo.push({reservation: roomReservation, room: room, hotel: hotel});
                        index++;
                        if (index === this.roomReservations.length) {
                          resolve();
                        }
                      }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
                }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
            }
          });
          done.then(() => {
            console.log('done');
            this.tableReservations.renderRows();
          });
        }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
