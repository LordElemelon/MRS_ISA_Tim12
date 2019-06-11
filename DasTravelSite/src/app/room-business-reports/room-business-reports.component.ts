import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HotelApi, RoomReservationApi, Hotel } from '../shared/sdk';

@Component({
  selector: 'app-room-business-reports',
  templateUrl: './room-business-reports.component.html',
  styleUrls: ['./room-business-reports.component.scss']
})
export class RoomBusinessReportsComponent implements OnInit {

  userType;

  isIncomeForm = null;
  isOccupancyForm = null;
  isChart = null;
  isRatingReport = null;

  roomsForRating = [];
  hotelForRating = {name: '', rating: '', ratingCount: ''};
  columnsToDisplayRoom = ['number', 'rating', 'ratingCount'];

  @ViewChild('incomeform') incomeFormDirective;
  incomeForm: FormGroup;

  @ViewChild('occupancyform') occupancyFormDirective;
  occupancyForm: FormGroup;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  setToIncomeForm() {
    this.isIncomeForm = true;
    this.isChart = null;
    this.isOccupancyForm = null;
    this.isRatingReport = null;
  }

  setToChart() {
    this.isIncomeForm = null;
    this.isChart = true;
    this.isOccupancyForm = null;
    this.isRatingReport = null;
  }

  setToOccupancyForm() {
    this.isIncomeForm = null;
    this.isChart = null;
    this.isOccupancyForm = true;
    this.isRatingReport = null;
  }

  setToRatingReport() {
    this.createRatingReport();
    this.isIncomeForm = null;
    this.isChart = null;
    this.isOccupancyForm = null;
    this.isRatingReport = null;
    this.isRatingReport = true;
  }

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [50, 40, 30, 70, 50, 66, 70], label: 'Series B'}
  ];

  constructor(private loginService: LoginServiceService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private hotelService: HotelApi,
    private reservationService: RoomReservationApi) {
      this.loginService.user.subscribe(data => {
        if (data) {
          this.userType = data.user.type;
        }
      });
      this.createIncomeForm();
      this.createOccupancyForm();
     }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
        duration: 2000,
    });
  }

  ngOnInit() {
  }

  createIncomeForm() {
    this.incomeForm = this.fb.group({
      type: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
    this.incomeForm.valueChanges.subscribe(data => this.onIncomeValueChanged(data));
    this.onIncomeValueChanged();
  }

  onIncomeValueChanged(data?: any) {
    if (!this.incomeForm) {
      return;
    }
    const form = this.incomeForm;
    for (const field in this.incomeFormErrors) {
      if (this.incomeFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.incomeFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.incomeFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.incomeFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  incomeFormErrors = {
    'type': '',
    'start': '',
    'end': ''
  };

  incomeFormValidationMessages = {
    'type': {
      'required': 'Type is required'
    },
    'start': {
      'required': 'Start date is required'
    },
    'end': {
      'required': 'End date is required'
    }
  };

  onIncomeSubmit() {
    this.hotelService.findOne({where: {name: 'hotel1'}})
    .subscribe(
      (result) => {
        var my_result = result as Hotel;
        var observable;
        if (this.incomeForm.value.type === 'yearly') {
          observable = this.reservationService.getYearlyReport(new Date(this.incomeForm.value.start).toJSON(),
          new Date(this.incomeForm.value.end).toJSON(), my_result.id, 1)
        } else if (this.incomeForm.value.type === 'monthly') {
          observable = this.reservationService.getMonthlyReport(new Date(this.incomeForm.value.start).toJSON(),
          new Date(this.incomeForm.value.end).toJSON(), my_result.id, 1)
        } else {
          observable = this.reservationService.getWeeklyReport(new Date(this.incomeForm.value.start).toJSON(),
          new Date(this.incomeForm.value.end).toJSON(), my_result.id, 1)
        }
        observable.subscribe(
          (result) => {
            this.barChartLabels = result.retval.labels;
            this.barChartData = [{data: [], label: "Income"}];
            this.barChartData[0].data = result.retval.sums;
            this.setToChart();
          },
          (err) => {
            this.openSnackBar("Failed to retrieve business report", "Dismiss");
          }
        )
      },
      (err) => {
        this.openSnackBar("Failed to find hotel1", "Dismiss");
      }
    )
  }

  createOccupancyForm() {
    this.occupancyForm = this.fb.group({
      type: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
    this.occupancyForm.valueChanges.subscribe(data => this.onOccupancyValueChanged(data));
    this.onOccupancyValueChanged();
  }

  onOccupancyValueChanged(data?: any) {
    if (!this.occupancyForm) {
      return;
    }
    const form = this.occupancyForm;
    for (const field in this.occupancyFormErrors) {
      if (this.occupancyFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.occupancyFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.occupancyFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.occupancyFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  occupancyFormErrors = {
    'type': '',
    'start': '',
    'end': ''
  };

  occupancyFormValidationMessages = {
    'type': {
      'required': 'Type is required'
    },
    'start': {
      'required': 'Start date is required'
    },
    'end': {
      'required': 'End date is required'
    }
  };

  onOccupancySubmit() {
    this.hotelService.findOne({where: {name: 'hotel1'}})
      .subscribe(
        (result) => {
          var my_result = result as Hotel;
          var observable;
          if (this.occupancyForm.value.type === 'yearly') {
            observable = this.reservationService.getYearlyReport(new Date(this.occupancyForm.value.start).toJSON(),
              new Date(this.occupancyForm.value.end).toJSON(), my_result.id, 0)
          } else if (this.occupancyForm.value.type === 'monthly') {
            observable = this.reservationService.getMonthlyReport(new Date(this.occupancyForm.value.start).toJSON(),
              new Date(this.occupancyForm.value.end).toJSON(), my_result.id, 0)
          } else {
            observable = this.reservationService.getWeeklyReport(new Date(this.occupancyForm.value.start).toJSON(),
              new Date(this.occupancyForm.value.end).toJSON(), my_result.id, 0)
          }
          observable.subscribe(
            (result) => {
              this.barChartLabels = result.retval.labels;
              this.barChartData = [{data: [], label: "Occupancy"}];
              this.barChartData[0].data = result.retval.sums;
              this.setToChart();
            },
            (err) => {
              this.openSnackBar("Failed to retrieve business report", "Dismiss");
            }
          )
        },
        (err) => {
          this.openSnackBar("Failed to find hotel1", "Dismiss");
        }
      )
  }

  createRatingReport() {
    console.log('harru');
    this.hotelService.findOne({where: {name: 'hotel1'}})
    .subscribe(
      (result) => {
          var my_result = result as Hotel;
          console.log("Haru");
          this.reservationService.getRatingReport(my_result.id)
          .subscribe(
            (result) => {
              this.roomsForRating = result.retval.rooms;
              this.hotelForRating = result.retval.hotel;
              console.log(this.hotelForRating);
            },
            (err) => {
              this.openSnackBar("Failed to retrieve business report", "Dismiss");
            }
          )
      },
      (err) => {
        this.openSnackBar("Failed to find hotel1", "Dismiss");
      });
  }

}
