import { Component, OnInit } from '@angular/core';
import { BranchApi } from '../shared/sdk';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-list-branches',
  templateUrl: './list-branches.component.html',
  styleUrls: ['./list-branches.component.scss']
})
export class ListBranchesComponent implements OnInit {

  foundBranches;

  constructor(private branchService: BranchApi,
    private itemService: ItemService) {
    this.branchService.find({where: {rentalServiceId: this.itemService.getServiceId()}})
    .subscribe(
      (result) => {
        this.foundBranches = result;
      },
      (err) => {
        console.log("Failed to retrieve branches");
      }
    )
   }

  ngOnInit() {
  }

}
