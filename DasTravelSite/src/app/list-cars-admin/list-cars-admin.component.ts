import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { CarApi } from '../shared/sdk';

@Component({
  selector: 'app-list-cars-admin',
  templateUrl: './list-cars-admin.component.html',
  styleUrls: ['./list-cars-admin.component.scss']
})
export class ListCarsAdminComponent implements OnInit {


  foundCars;

  constructor(private itemService: ItemService,
    private carService: CarApi) {
      this.carService.find({where: {rentalServiceId: this.itemService.getServiceId()}})
      .subscribe(
        (result) => {
          this.foundCars = result;
        },
        (err) => {
          console.log(err);
        }
      )
     }

  ngOnInit() {
  }

}
