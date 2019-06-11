import { Component, OnInit, Inject } from '@angular/core';
import { RentalServiceApi, RentalService, LoopBackConfig } from '../shared/sdk';
import {MatDialog, MatSnackBar} from '@angular/material';
import { API_VERSION } from '../shared/baseUrl';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-listallservices',
  templateUrl: './listallservices.component.html',
  styleUrls: ['./listallservices.component.scss']
})
export class ListallservicesComponent implements OnInit {

  constructor(@Inject('baseURL') private baseURL,
  private rentalServiceService: RentalServiceApi,
  public dialog: MatDialog,
  public snackBar: MatSnackBar) { 
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.rentalServiceService.find()
    .subscribe(
      (result) => {
        this.foundServices = result as RentalService[];
      },
      (err) => {
        this.openSnackBar("Failed to retrieve rental services", "Dismiss");
      }
    )
  }

  foundServices: RentalService[];

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  openMap(service) {
    this.dialog.open(MapComponent, {width: '80%', height: '80%', data: {lat: service.latitude, lng: service.longitude}});
  }
}
