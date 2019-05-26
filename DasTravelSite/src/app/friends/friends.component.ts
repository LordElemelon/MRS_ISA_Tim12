import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoopBackConfig, Myuser, UserInfo, Friendship } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { MyuserApi, UserInfoApi, FriendshipApi } from '../shared/sdk/services';
import { MatSnackBar, MatTable } from '@angular/material';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  userType: string;
  userId: string;

  selectedFriend: any = null;
  friendList: any[] = [];
  setClickedRowF : Function;
  displayedColumnsF: string[] = ['fullName', 'username'];
  @ViewChild('friendTable') friendTable: MatTable<any>;

  selectedRequest: any = null;
  requestList: any[] = [];
  setClickedRowR : Function;
  displayedColumnsR: string[] = ['username'];
  @ViewChild('requestTable') requestTable: MatTable<any>;

  addFriendForm: FormGroup;
  @ViewChild('fformAddFriend') addFriendFormDirective;

  addFriendFormErrors = {
    'username': ''
  };

  addFriendFormValidationMessages = {
    'username': {
      'required' : 'Username is required'
    }
  };

  /****** BASIC FUNCTIONS ******/

  constructor(@Inject('baseURL') private baseURL,
  private fb: FormBuilder,
  private myuserService: MyuserApi,
  private userInfoService: UserInfoApi,
  private friendshipService: FriendshipApi,
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
    this.setClickedRowF = function(index){
      this.selectedFriend = index;
    }
    this.setClickedRowR = function(index){
      this.selectedRequest = index;
    }
  }

  ngOnInit() {
    this.createAddFriendForm();
    this.refreshFriends();
    this.refreshRequests();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
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

  refreshRequests() {
    this.requestList = [];
    this.friendshipService.find().subscribe(
      result => {
        let gottenFriends: Friendship[] = result as Friendship[];
        console.log(gottenFriends);
        for (const friendship of gottenFriends) {
          if (friendship.secondUserId == this.userId && !friendship.accepted) {
            let friendId: string = friendship.firstUserId;
            let request: any = {
              friendship: friendship
            };

            this.myuserService.findById(friendId).subscribe(
              result => {
                let friendUser: Myuser = result as Myuser;
                request['username'] = friendUser.username;
                this.requestList.push(request);
                this.requestTable.renderRows();
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

  /****** ADD FRIEND FORM ******/

  onValueChangedAddFriend(data?: any) {
    if (!this.addFriendForm) {return; }
    const form = this.addFriendForm;
    for (const field in this.addFriendFormErrors){
      if (this.addFriendFormErrors.hasOwnProperty(field)){
        this.addFriendFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addFriendFormValidationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.addFriendFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddFriendForm() {
    this.addFriendForm = this.fb.group({
      'username': ['', Validators.required]
    });

    this.addFriendForm.valueChanges
      .subscribe(data => this.onValueChangedAddFriend(data));
    this.onValueChangedAddFriend();
  }

  onAddFriendSubmit() {
    let inputUsername = this.addFriendForm.value.username;
    this.myuserService.findOne({where: {username: inputUsername}}).subscribe(
      result => {
        if (result != null && result != {}) {
          let toAddUser: Myuser = result as Myuser;
          this.friendshipService.create({
            firstUserId: this.userId,
            secondUserId: toAddUser.id,
            accepted: false
          }).subscribe(
            result => {
              this.openSnackBar("Sent request to " + toAddUser.username, "Dismiss");
            },
            err => {
              console.log(err);
            }
          );
        }
        else {
          this.openSnackBar("No user with given username", "Dismiss");
        }
      },
      err => {
        this.openSnackBar("No user with given username", "Dismiss");
        console.log(err);
      }
    );
  }

  /****** BUTTON PRESSES ******/

  deleteFriendButton() {
    if (this.selectedFriend != null) {
      let friendship: Friendship = this.selectedFriend.friendship as Friendship;
      this.friendshipService.deleteById(friendship.id).subscribe(
        result => {
          this.openSnackBar("Friend deleted from list", "Dismiss");
          this.refreshFriends();
          this.refreshRequests();
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  acceptButton() {
    if (this.selectedRequest != null) {
      let friendship: Friendship = this.selectedRequest.friendship as Friendship;
      this.friendshipService.updateAttributes(friendship.id, {
        firstUserId: friendship.firstUserId,
        secondUserId: friendship.secondUserId,
        accepted: true 
      }).subscribe(
        result => {
          this.openSnackBar("Accepted friend request", "Dismiss");
          this.refreshFriends();
          this.refreshRequests();
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  declineButton() {
    if (this.selectedRequest != null) {
      let friendship: Friendship = this.selectedRequest.friendship as Friendship;
      this.friendshipService.deleteById(friendship.id).subscribe(
        result => {
          this.openSnackBar("Declined friend request", "Dismiss");
          this.refreshFriends();
          this.refreshRequests();
        },
        err => {
          console.log(err);
        }
      );
    }
  }

}
