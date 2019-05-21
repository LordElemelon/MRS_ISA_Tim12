import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { RentalServiceApi, CarReservationApi, RentalService } from '../shared/sdk';

@Component({
  selector: 'app-car-business-reports',
  templateUrl: './car-business-reports.component.html',
  styleUrls: ['./car-business-reports.component.scss']
})
export class CarBusinessReportsComponent implements OnInit {

  userType;

  isIncomeForm = null;
  isIncomeChart = null;
  isOccupancyForm = null;

  @ViewChild('incomeform') incomeFormDirective;
  incomeForm : FormGroup;

  @ViewChild('occupancyform') occupancyFormDirective;
  occupancyForm : FormGroup;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  setToIncomeForm() {
    this.isIncomeForm = true;
    this.isIncomeChart = null;
    this.isOccupancyForm = null;
  }

  setToIncomeChart() {
    this.isIncomeForm = null;
    this.isIncomeChart = true;
    this.isOccupancyForm = null;
  }

  setToOccupancyForm() {
    this.isIncomeForm = null;
    this.isIncomeChart = null;
    this.isOccupancyForm = true;
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
    private rentalServiceService: RentalServiceApi,
    private reservationService: CarReservationApi) { 
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
      end: ['', Validators.required],
      rentalService: ['', Validators.required]
    });
    this.incomeForm.valueChanges.subscribe(data => this.onIncomeValueChanged(data));
    this.onIncomeValueChanged();
  }

  createOccupancyForm() {
    this.occupancyForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      rentalService: ['', Validators.required]
    });
    this.occupancyForm.valueChanges.subscribe(data => this.onOccupancyValueChanged(data));
    this.onOccupancyValueChanged();
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

  incomeFormErrors = {
    'type': '',
    'start': '',
    'end': '',
    'rentalService': ''
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
    },
    'rentalService': {
      'required': "Rental service is required"
    }
  };

  occupancyFormErrors = {
    'start': '',
    'end': '',
    'rentalService': ''
  };

  occupancyFormValidationMessages = {
    'start': {
      'required': 'Start date is required'
    },
    'end': {
      'required': 'End date is required'
    },
    'rentalService': {
      'required': "Rental service is required"
    }
  };

  onIncomeSubmit() {
    this.rentalServiceService.findOne({where: {name: this.incomeForm.value.rentalService}})
    .subscribe(
      (result) => {
        var my_result = result as RentalService;
        var observable;
        if (this.incomeForm.value.type === 'yearly') {
          observable = this.reservationService.getYearlyReport(new Date(this.incomeForm.value.start).toJSON(),
           new Date(this.incomeForm.value.end).toJSON(), my_result.id)
        } else if (this.incomeForm.value.type == 'monthly') {
          observable = this.reservationService.getMonthlyReport(new Date(this.incomeForm.value.start).toJSON(),
          new Date(this.incomeForm.value.end).toJSON(), my_result.id);
        } else {
          observable = this.reservationService.getWeeklyReport(new Date(this.incomeForm.value.start).toJSON(),
          new Date(this.incomeForm.value.end).toJSON(), my_result.id)
        }
        observable.subscribe(
          (result) => {
            this.barChartLabels = result.retval.labels;
            this.barChartData = [{data: [], label: "Income"}];
            this.barChartData[0].data = result.retval.sums;
            this.setToIncomeChart();
          },
          (err) => {
            this.openSnackBar("Failed to retrieve business report", "Dismiss");
          }
        )
      },
      (err) => {
        this.openSnackBar("Failed to find this rental service", "Dismiss");
      }
    )
  }

  onOccupancySubmit() {
    this.rentalServiceService.findOne({where: {name: this.occupancyForm.value.rentalService}})
    .subscribe(
      (result) => {
        var my_result = result as RentalService;
        this.reservationService.getOccupancyReport(new Date(this.occupancyForm.value.start).toJSON(),
          new Date(this.occupancyForm.value.end).toJSON(), my_result.id)
        .subscribe(
          (result) => {
            this.barChartLabels = result.retval.labels;
            this.barChartData = [{data: [], label: "Reserved vehicles"}, {data: [], label: "Free vehicles"}];
            this.barChartData[0].data = result.retval.sums;
            console.log(result);
            for (let count of this.barChartData[0].data) {
              this.barChartData[1].data.push(result.retval.totalVehicles - count);
            }
            this.setToIncomeChart();
          },
          (err) => {
            this.openSnackBar("Failed to retrieve business report", "Dismiss");
          }
        )
      },
      (err) => {
        this.openSnackBar("Failed to find this rental service", "Dismiss");
      }
    );
  }

}
