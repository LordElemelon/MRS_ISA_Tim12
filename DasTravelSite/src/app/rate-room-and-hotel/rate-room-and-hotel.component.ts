import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { RoomReservationApi, MyuserApi } from '../shared/sdk';
import { baseURL } from '../shared/baseUrl';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { RateCarAndServiceComponent } from '../rate-car-and-service/rate-car-and-service.component';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-rate-room-and-hotel',
  templateUrl: './rate-room-and-hotel.component.html',
  styleUrls: ['./rate-room-and-hotel.component.scss']
})
export class RateRoomAndHotelComponent implements OnInit {

  rateForm: FormGroup;
  @ViewChild('rateform') rateFormDirective;

  constructor(@Inject('baseURL') private baseURL,
  private myUserService: MyuserApi,
  private fb: FormBuilder,
  public dialogRef: MatDialogRef<RateRoomAndHotelComponent>,
  public snackBar: MatSnackBar,
  public roomReservationService: RoomReservationApi,
  private itemService: ItemService) {
    this.createRateForm();
   }

  ngOnInit() {
  }

  createRateForm() {
    this.rateForm = this.fb.group({
      'roomRate': ['', Validators.required],
      'hotelRate': ['', Validators.required]
    });
    this.rateForm.valueChanges
    .subscribe((data) => this.onRateValueChanged(data));
    this.onRateValueChanged();
  }

  onRateValueChanged(data?:any) {
    if (!this.rateForm) { return; }
    const form = this.rateForm;
    for (const field in this.rateFormErrors) {
      if (this.rateFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.rateFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.rateFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.rateFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  rateFormErrors = {
    'roomRate': '',
    'hotelRate': ''
  }

  rateFormValidationMessages = {
    'roomRate': {
      'required': 'Room rating is required'
    },
    'hotelRate': {
      'required': 'Hotel rating is required'
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
  }

  onRateSubmit() {
    var rId = this.itemService.getRoomReservationIdForRate();
    this.roomReservationService.rateHotelAndRoom(rId, this.rateForm.value.roomRate,
       this.rateForm.value.hotelRate)
    .subscribe(
      (result) => {
        this.openSnackBar("Thank you for your input!", "Dismiss");
        this.dialogRef.close();
      },
      (err) => {
        this.openSnackBar("Failed to add rating", "Dismiss");
      }
    )
  }





}
