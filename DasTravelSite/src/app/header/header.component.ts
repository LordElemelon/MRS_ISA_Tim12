import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { MyuserApi } from '../shared/sdk/services/custom/Myuser'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private myUserService: MyuserApi,
    public snackBar: MatSnackBar) { }

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
      },
      (err) => {
        this.openSnackBar("Logging out failed","Dismiss");
      })
  }

}
