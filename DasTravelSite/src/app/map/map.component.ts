import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat = 0;
  lng = 0;
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.lat = this.data.lat;
    this.lng = this.data.lng;
  }
}
