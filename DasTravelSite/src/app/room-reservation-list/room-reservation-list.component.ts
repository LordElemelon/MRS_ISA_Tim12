import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {HotelSpecialOffer, ReservationOffer, Room, RoomReservation} from '../shared/sdk/models';
import {HotelApi, HotelSpecialOfferApi, MyuserApi, ReservationOfferApi, RoomApi, RoomReservationApi} from '../shared/sdk/services/custom';
import {MatSnackBar, MatTable, MatDialog} from '@angular/material';
import { ItemService } from '../services/item.service';
import { RateRoomAndHotelComponent } from '../rate-room-and-hotel/rate-room-and-hotel.component';

@Component({
  selector: 'app-room-reservation-list',
  templateUrl: './room-reservation-list.component.html',
  styleUrls: ['./room-reservation-list.component.scss']
})
export class RoomReservationListComponent implements OnInit {
  roomReservations: RoomReservation[];
  reservationsInfo = [];
  specialOffers = [];
  pageNum = 0;
  pageSize = 8;
  selectedReservation = '';
  specialOffersDict = {};

  columnsToDisplayReservations = ['hotel', 'roomNumber', 'beds', 'startDate', 'endDate', 'price', 'action', 'rate'];
  columnsToDisplaySpecialOffers = ['name'];

  @ViewChild('tablereservations') tableReservations: MatTable<any>;
  @ViewChild('tablespecialoffers') tableSpecialOffers: MatTable<any>;

  constructor(@Inject('baseURL') private baseURL,
              private myuserservice: MyuserApi,
              private hotelservice: HotelApi,
              private roomservice: RoomApi,
              private roomresesrvationservice: RoomReservationApi,
              private reservationspecialofferservice: ReservationOfferApi,
              private specialofferservice: HotelSpecialOfferApi,
              private snackBar: MatSnackBar,
              private itemService: ItemService,
              public dialog: MatDialog
              ) { }

  ngOnInit() {
    this.getReservations();
  }

  getReservations() {
    if (this.myuserservice.getCachedCurrent()) {
      this.myuserservice.getRoomReservations(this.myuserservice.getCachedCurrent().id,
        this.pageSize, this.pageNum * this.pageSize)
        .subscribe(result => {
          this.reservationsInfo = [];
          this.roomReservations = result.retval;
          const done = new Promise((resolve, reject) => {
            let index = 0;
            for (const roomReservation of this.roomReservations) {
              this.roomservice.findById(roomReservation.roomId)
                .subscribe((room: Room) => {
                  this.hotelservice.findById(roomReservation.hotelId)
                    .subscribe((hotel) => {
                      this.reservationsInfo.push({reservation: roomReservation, room: room, hotel: hotel});
                      this.reservationspecialofferservice.find({where: {'roomReservationId': roomReservation.id}})
                        .subscribe((reservationOfferIds: ReservationOffer[]) => {
                          const done1 = new Promise((resolve1, reject1) => {
                            if (reservationOfferIds.length === 0) {
                              resolve1();
                            }
                            let indexOffers = 0;
                            const offers = [];
                            for (const reservationOfferId of reservationOfferIds) {
                              this.specialofferservice.findById(reservationOfferId.specialOfferId)
                                .subscribe((specialOffer: HotelSpecialOffer) => {
                                  offers.push(specialOffer);
                                  indexOffers++;
                                  if (indexOffers === reservationOfferIds.length) {
                                    this.specialOffersDict[roomReservation.id] = offers;
                                    resolve1();
                                  }
                                });
                            }
                          });
                          done1
                            .then(() => {
                              index++;
                              if (index === this.roomReservations.length) {
                                resolve();
                              }
                            });
                        });
                    }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
                }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
            }
          });
          done.then(() => {
            this.tableReservations.renderRows();
          })
            .catch(err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
        }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  nextPage() {
    if (this.reservationsInfo.length === this.pageSize) {
      this.pageNum++;
      this.getReservations();
    }
  }

  previousPage() {
    if (this.pageNum > 0) {
      this.pageNum--;
      this.getReservations();
    }
  }

  deleteReservation(id: any) {
    this.roomresesrvationservice.cancel(id)
      .subscribe(
        (result) => {
          for (const resInfo of this.reservationsInfo) {
            if (resInfo.reservation.id === id) {
              this.reservationsInfo.splice(this.reservationsInfo.indexOf(resInfo), 1);
              break;
            }
          }
          this.tableReservations.renderRows();
          this.openSnackBar('Successfully cancelled reservation', 'Dismiss');
        },
        (err) => {
          this.openSnackBar('Can not cancel this reservation, it is too late', 'Dismiss');
        }
      );
  }

  selectReservation(id: any) {
    this.selectedReservation = id;
    this.specialOffers = this.specialOffersDict[id];
    this.tableSpecialOffers.renderRows();

  }
  rateReservation(id: any) {
    this.itemService.setRoomReservationIdForRate(id);
    this.dialog.open(RateRoomAndHotelComponent, {width: '500px', height: '450 px'});
  }
}
