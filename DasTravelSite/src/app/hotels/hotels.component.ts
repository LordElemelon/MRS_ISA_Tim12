import { Component, OnInit, Inject } from '@angular/core';
import { LoopBackConfig } from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { HotelApi } from '../shared/sdk/services'
import { Hotel } from '../shared/sdk/models/'

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

  foundHotels: Hotel[];

  constructor(@Inject('baseURL') private baseURL,
    private hotelservice: HotelApi
    ) {

      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
   }

  ngOnInit() {
    this.hotelservice.find().subscribe((hotels: Hotel[]) => this.foundHotels = hotels);
  }

}
