import {Component, Inject, OnInit} from '@angular/core';
import {ItemService} from '../services/item.service';
import {LoginServiceService} from '../login-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MyuserApi, RoomReservationApi} from '../shared/sdk/services/custom';

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
              private fb: FormBuilder) {
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
      startDate: this.room.startDate,
      endDate: this.room.endDate,
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
        console.log(result);
      }, err => {
        console.log(err);
      });
  }

}
