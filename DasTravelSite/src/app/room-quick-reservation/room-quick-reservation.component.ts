import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HotelApi, MyuserApi, RoomApi, RoomReservationApi} from '../shared/sdk/services/custom';
import {Router} from '@angular/router';
import {MatSnackBar, MatTable} from '@angular/material';
import {LoginServiceService} from '../login-service.service';
import {LoopBackConfig, Room, RoomReservation} from '../shared/sdk';
import {API_VERSION} from '../shared/baseUrl';

@Component({
  selector: 'app-room-quick-reservation',
  templateUrl: './room-quick-reservation.component.html',
  styleUrls: ['./room-quick-reservation.component.scss']
})
export class RoomQuickReservationComponent implements OnInit {

  minDate = new Date();
  userType: string;
  foundReservations: RoomReservation[];
  reservationsInfo = [];
  searchActive = true;
  searchDone = false;
  columnsToDisplayReservations = ['hotel', 'roomNumber', 'beds', 'startDate', 'endDate', 'price'];
  selectedReservationId;

  searchQRoomsForm: FormGroup;
  @ViewChild('fformSearchQRooms') searchQRoomsFormDirective;

  @ViewChild('tablereservations') tableReservations: MatTable<any>;

  searchQRoomsFormErrors = {
    'startDate': '',
    'endDate': ''
  };
  searchQRoomsFormValidationMessages = {
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

  constructor(@Inject('baseURL') private baseURL,
              private roomreservationservice: RoomReservationApi,
              private roomservice: RoomApi,
              private hotelservice: HotelApi,
              private myuserservice: MyuserApi,
              private _router: Router,
              private fb: FormBuilder,
              private loginService: LoginServiceService,
              public snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.minDate.setHours(0, 0, 0, 0);
    this.createSearchQRoomsForm();
    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onValueChangedSearchQRooms(data?: any)  {
    if (!this.searchQRoomsForm) {return; }
    const form = this.searchQRoomsForm;
    for (const field in this.searchQRoomsFormErrors) {
      if (this.searchQRoomsFormErrors.hasOwnProperty(field)) {
        this.searchQRoomsFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.searchQRoomsFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.searchQRoomsFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
    const startDate = form.get('startDate').value;
    const endDate = form.get('endDate').value;
    if (startDate < this.minDate) {
      this.searchQRoomsFormErrors['startDate'] += this.searchQRoomsFormValidationMessages['startDate']['min'] + ' ';
      this.searchQRoomsForm.controls['startDate'].setErrors({'min' : true});
    }
    if (endDate < this.minDate) {
      this.searchQRoomsFormErrors['endDate'] += this.searchQRoomsFormValidationMessages['endDate']['min'] + ' ';
      this.searchQRoomsForm.controls['endDate'].setErrors({'min' : true});
    }
    if (endDate <= startDate)  {
      this.searchQRoomsFormErrors['endDate'] += this.searchQRoomsFormValidationMessages['endDate']['max'] + ' ';
      this.searchQRoomsForm.controls['endDate'].setErrors({'max' : true});
    }
  }

  createSearchQRoomsForm() {
    this.searchQRoomsForm = this.fb.group({
      startDate: [this.minDate, [Validators.required]],
      endDate: [this.minDate, [Validators.required]]
    });

    this.searchQRoomsForm.valueChanges
      .subscribe(data => this.onValueChangedSearchQRooms(data));
    this.onValueChangedSearchQRooms();
  }

  onSearchQRoomsSubmit() {
    const data = this.searchQRoomsForm.value;
    this.roomreservationservice.find({where: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        myuserId: null
      }}).subscribe((reservations: RoomReservation[]) => {
        this.foundReservations = reservations;
        this.searchDone = true;
        this.searchActive = false;
        this.reservationsInfo = [];
        const done = new Promise((resolve, reject) => {
        let index = 0;
        for (const roomReservation of this.foundReservations) {
          this.roomservice.findById(roomReservation.roomId)
            .subscribe((room: Room) => {
              this.hotelservice.findById(room.hotelId)
                .subscribe((hotel) => {
                  this.reservationsInfo.push({reservation: roomReservation, room: room, hotel: hotel});
                  index++;
                  if (index === this.foundReservations.length) {
                    resolve();
                  }
                }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
            }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
        }
      });
      done.then(() => {
        this.tableReservations.renderRows();
      });
    }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
  }

  selectRow(id) {
    this.selectedReservationId = id;
  }

  reserve() {
    this.roomreservationservice.quickReservation(this.selectedReservationId,
      this.myuserservice.getCachedCurrent().id, '1')
      .subscribe(reservation => {
        this.openSnackBar('Reservation succesful', 'Dismiss');
      }, err => {
        this.openSnackBar('Reservation failed. Please search and try again', 'Dismiss');
      });
  }
}
