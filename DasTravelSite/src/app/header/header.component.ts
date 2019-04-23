import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { MyuserApi } from '../shared/sdk/services/custom';
import { BehaviorSubject} from 'rxjs';
import { Myuser } from '../shared/sdk/models';
import {LoginServiceService} from '../login-service.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userType: string;
  constructor(public dialog: MatDialog,
    private myUserService: MyuserApi,
    private location: Location,
    private loginService: LoginServiceService,
    public snackBar: MatSnackBar) {
      loginService.user.subscribe(data => {
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

  openRegisterForm() {
    this.dialog.open(RegisterComponent, {width: '500px', height: '450 px'});
  }

  openLoginForm() {
    this.dialog.open(LoginComponent, {width: '500px', height: '450 px'});
  }

  logout() {
    this.myUserService.logout()
    .subscribe(
      (result) => {
        this.openSnackBar("Logged out successfuly ","Dismiss");
        this.userType = null;
        this.location.replaceState('/home');
        this.location.forward();
      },
      (err) => {
        this.openSnackBar("Logging out failed","Dismiss");
      });
  }

}
