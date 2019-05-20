import { Component, OnInit } from '@angular/core';
import { MyuserApi } from '../shared/sdk';
import { MatSnackBar } from '@angular/material';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  airlinesActive = false;
  userType: string = null;

  constructor(private loginService: LoginServiceService,
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

  airlinesButton() {
    this.airlinesActive = true;
  }

}
