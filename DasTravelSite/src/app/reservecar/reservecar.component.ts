import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Car } from '../shared/sdk';

@Component({
  selector: 'app-reservecar',
  templateUrl: './reservecar.component.html',
  styleUrls: ['./reservecar.component.scss']
})
export class ReservecarComponent implements OnInit {

  car: Car;

  constructor(private itemService: ItemService) {
    this.car = this.itemService.getReservableCar();
   }

  ngOnInit() {
  }

}
