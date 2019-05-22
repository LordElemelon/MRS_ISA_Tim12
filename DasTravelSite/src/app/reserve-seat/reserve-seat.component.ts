import { Component, Input, OnInit, Inject, ViewChild } from '@angular/core';
import {LoopBackConfig, Flight, Seat, SeatId, SeatReservation, Friendship, Myuser, UserInfo} from '../shared/sdk';
import {FlightApi, SeatApi, SeatIdApi, SeatReservationApi, FriendshipApi, MyuserApi, UserInfoApi} from '../shared/sdk/services';
import {API_VERSION} from '../shared/baseUrl';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatTable} from '@angular/material';
import {LoginServiceService} from '../login-service.service';

@Component({
  selector: 'app-reserve-seat',
  templateUrl: './reserve-seat.component.html',
  styleUrls: ['./reserve-seat.component.scss']
})
export class ReserveSeatComponent implements OnInit {
  @Input() selectedFlight: Flight;

  userType: string;
  userId: string;

  inviteActive = false;

  setClickedRow : Function;
  selectedSeat: Seat = null;
  seatList: Seat[] = null;
  seatPrices = {};
  classTypes = {
    'e': 'Economy class',
    'b': 'Business class',
    'f': 'First class'
  };
  displayedColumns: string[] = ['row', 'column', 'classType', 'price'];
  @ViewChild('seatTable') seatTable: MatTable<any>;

  selectedFriend: any = null;
  friendList: any[] = [];
  setClickedRowF : Function;
  displayedColumnsF: string[] = ['fullName', 'username'];
  @ViewChild('friendTable') friendTable: MatTable<any>;

  constructor(@Inject('baseURL') private baseURL,
              private flightservice: FlightApi,
              private seatservice: SeatApi,
              private friendshipService: FriendshipApi,
              private myuserService: MyuserApi,
              private userInfoService: UserInfoApi,
              private seatreservationservice: SeatReservationApi,
              private fb: FormBuilder,
              private loginService: LoginServiceService,
              public snackBar: MatSnackBar) {
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        this.userId = data.user.id;
      }
    });
    this.setClickedRow = function(index){
      this.selectedSeat = index;
    }
    this.setClickedRowF = function(index){
      this.selectedFriend = index;
    }
  }

  ngOnInit() {
    this.refreshSeats();
  }

  refreshSeats() {
    this.flightservice.findAvailableSeats(this.selectedFlight.id)
    .subscribe(result => {
      this.seatPrices = {};
      for (const seat of result.retval) {
        this.seatPrices[seat.id] = (seat.classType == 'e') ? this.selectedFlight.price : 
          ((seat.classType == 'f') ? this.selectedFlight.price * 1.5 : this.selectedFlight.price * 1.2);
        this.seatPrices[seat.id] = Math.round(this.seatPrices[seat.id]);
      }
      this.seatList = result.retval;
      console.log(result.retval);
    }, err => {
      console.log(err);
    });
  }

  refreshFriends() {
    this.friendList = [];
    this.friendshipService.find().subscribe(
      result => {
        let gottenFriends: Friendship[] = result as Friendship[];
        console.log(gottenFriends);
        for (const friendship of gottenFriends) {
          if (friendship.firstUserId == this.userId || friendship.secondUserId == this.userId && friendship.accepted) {
            console.log(friendship);
            let friendId: string = (friendship.firstUserId == this.userId) ? friendship.secondUserId : friendship.firstUserId;
            let friend: any = {
              friendship: friendship
            };
            friend['id'] = friendId;

            this.myuserService.findById(friendId).subscribe(
              result => {
                let friendUser: Myuser = result as Myuser;
                friend['username'] = friendUser.username;
                this.userInfoService.find().subscribe(
                  result => {
                    let infos: UserInfo[] = result as UserInfo[];
                    for(const info of infos) {
                      if (info.userIdId == friendId) {
                        console.log(JSON.stringify(info));
                        let friendInfo: UserInfo = info as UserInfo;
                        friend['fullName'] = (friendInfo.firstName == "" && friendInfo.lastName == "") ?
                          "-" : friendInfo.firstName + " " + friendInfo.lastName;
                        
                      }
                    }
                  },
                  err => {
                    console.log(err);
                  }
                );
                this.friendList.push(friend);
                this.friendTable.renderRows();
              },
              err => {
                console.log(err);
              }
            );
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  reserveButton() {
    if (this.selectedSeat != null) {
      console.log(this.userId);
      this.seatreservationservice.makeReservation(this.selectedSeat.id, this.userId, this.seatPrices[this.selectedSeat.id])
      .subscribe(
        (result) => {
          this.openSnackBar("Reservation successfuly made", "Dismiss");
          this.refreshSeats();
        },
        (err) => {
          this.openSnackBar("Failed to make reservation", "Dismiss");
        }
      );
    }
  }

  inviteButton() {
    if (this.selectedSeat != null) {
      this.inviteActive = true;

      this.refreshFriends();
    }
  }

  inviteFriendButton() {
    if (this.selectedFriend != null) {
      this.seatreservationservice.makeReservation(this.selectedSeat.id, this.selectedFriend.id, this.seatPrices[this.selectedSeat.id])
      .subscribe(
        (result) => {
          this.openSnackBar("Reservation successfuly made", "Dismiss");
          console.log(result);
          this.cancelInviteFriendButton();
        },
        (err) => {
          this.openSnackBar("Failed to make reservation", "Dismiss");
        }
      );
    }
  }

  cancelInviteFriendButton() {
    this.friendList = [];
    this.selectedFriend = null;

    this.inviteActive = false;

    this.refreshSeats();
  }

}
