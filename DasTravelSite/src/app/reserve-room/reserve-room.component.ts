import {Component, Inject, OnInit} from '@angular/core';
import {ItemService} from '../services/item.service';
import {LoginServiceService} from '../login-service.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HotelSpecialOfferApi, MyuserApi, ReservationOfferApi, RoomReservationApi} from '../shared/sdk/services/custom';
import {MatSnackBar} from '@angular/material';
import {HotelSpecialOffer} from '../shared/sdk/models';

@Component({
  selector: 'app-reserve-room',
  templateUrl: './reserve-room.component.html',
  styleUrls: ['./reserve-room.component.scss']
})
export class ReserveRoomComponent implements OnInit {

  room: any;
  userType;
  reserveForm: FormGroup;
  availableOffers: HotelSpecialOffer[];
  selectedOffers = [];
  columnsToDisplaySpecialOffer = ['name', 'price'];
  canUseBonusPointsRoom = false;
  usingBonusPointsRoom = false;
  realPrice = 0;

  constructor(@Inject('baseURL') private baseURL,
              private itemservice: ItemService,
              private loginService: LoginServiceService,
              private roomreservationservice: RoomReservationApi,
              private myuserservice: MyuserApi,
              private hotelspecialofferservice: HotelSpecialOfferApi,
              private reservationofferservice: ReservationOfferApi,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
    loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        if (data.user.bonusPoints >= 100 && this.userType === 'registeredUser') {
          this.canUseBonusPointsRoom = true;
        }
      }
    });
    this.createReserveForm();
  }

  ngOnInit() {
    this.room = this.itemservice.getReservableRoom();
    this.updateReserveForm();
    this.hotelspecialofferservice.find({where: {hotelId: this.room.room.hotelId}})
      .subscribe((specialOffers: HotelSpecialOffer[]) => {
        this.availableOffers = specialOffers;
      }, err => this.openSnackBar('Can not find special offers for this hotel', 'Dismiss'));
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
    this.realPrice = this.room.room.price;
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
      this.myuserservice.getCachedCurrent().id, this.room.room.price, '', this.room.room.hotelId, this.usingBonusPointsRoom)
      .subscribe(result => {
        this.openSnackBar('Reserved succesfully', 'Dismiss');
        let i = 0;
        for (const offerId of this.selectedOffers) {
          setTimeout(() => {
            this.reservationofferservice.create({'specialOfferId': offerId, 'roomReservationId': result.retval.id})
              .subscribe(() => console.log());
          }, i * 1000);
          i++;
        }
      }, err => {
        this.openSnackBar('Can not reserve on this date. Please search and try again.', 'Dismiss');
      });
  }

  toggleRow(id: number) {
    let specialOffer = null;
    for (const offer of this.availableOffers) {
      if (offer.id === id) {
        specialOffer = offer;
        break;
      }
    }
    const index = this.selectedOffers.indexOf(id);
    const price = this.reserveForm.value.price;
    if (index >= 0)  {
      this.selectedOffers.splice(index, 1);
      this.reserveForm.patchValue({'price': price - specialOffer.price});
    } else  {
      this.selectedOffers.push(id);
      this.reserveForm.patchValue({'price': price + specialOffer.price});
    }
  }


  roomCheckboxClicked() {
    if (!this.usingBonusPointsRoom) {
      this.reserveForm.patchValue({
        'price': Math.round(this.realPrice * 0.1 + this.reserveForm.value.price)}
      )
    } else {
      this.reserveForm.patchValue({
        price: Math.round(this.reserveForm.value.price - 0.1 * this.realPrice)}
      )
    }
    
  }

}
