import {Component, Inject, OnInit} from '@angular/core';
import {ItemService} from '../services/item.service';
import {LoginServiceService} from '../login-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MyuserApi, RoomReservationApi} from '../shared/sdk/services/custom';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-reserve-room',
  templateUrl: './reserve-room.component.html',
  styleUrls: ['./reserve-room.component.scss']
})
export class ReserveRoomComponent implements OnInit {

  room: any;
  userType;
  reserveForm: FormGroup;

  constructor(@Inject('baseURL') private baseURL,
              private itemservice: ItemService,
              private loginService: LoginServiceService,
              private roomreservationservice: RoomReservationApi,
              private myuserservice: MyuserApi,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
    loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
    this.createReserveForm();
  }

  ngOnInit() {
    this.room = this.itemservice.getReservableRoom();
    this.updateReserveForm();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createReserveForm() {
    this.reserveForm = this.fb.group({
      startDate: '',
      endDate: '',
      hotel: '',
      roomNumber: '',
      beds: '',
      description: '',
      price: ''
    });
  }

  updateReserveForm() {
    this.reserveForm.reset({
      startDate: this.room.startDate.getDate() + '/' + (this.room.startDate.getMonth() + 1) + '/' + this.room.startDate.getFullYear(),
      endDate: this.room.endDate.getDate() + '/' + (this.room.endDate.getMonth() + 1) + '/' + this.room.endDate.getFullYear(),
      hotel: this.room.room.hotel,
      roomNumber: this.room.room.room.number,
      beds: this.room.room.room.beds,
      description: this.room.room.room.description,
      price: this.room.room.price
    });
  }

  onReserveRoomSubmit() {
    this.roomreservationservice.makeReservation(this.room.startDate.toISOString(),
      this.room.endDate.toISOString(), this.room.room.room.id,
      this.myuserservice.getCachedCurrent().id, this.room.room.price)
      .subscribe(result => {
        this.openSnackBar('Reserved succesfully', 'Dismiss');
      }, err => {
        this.openSnackBar('Can not reserve on this date. Please search and try again.', 'Dismiss');
      });
  }

}
