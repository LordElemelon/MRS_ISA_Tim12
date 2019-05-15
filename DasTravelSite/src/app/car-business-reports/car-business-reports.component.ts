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

  @ViewChild('incomeform') incomeFormDirective;
  incomeForm : FormGroup;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  setToIncomeForm() {
    this.isIncomeForm = true;
    this.isIncomeChart = null;
  }

  setToIncomeChart() {
    this.isIncomeForm = null;
    this.isIncomeChart = true;
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

  onIncomeSubmit() {
    console.log("Submit pressed");
    this.rentalServiceService.find({where: {name: this.incomeForm.value.rentalService}})
    .subscribe(
      (result) => {
        var my_result = result as RentalService[];
        this.reservationService.getYearlyReport(new Date(this.incomeForm.value.start).toJSON(), new Date(this.incomeForm.value.end).toJSON(),
        my_result[0].id)
        .subscribe(
          (result) => {
            this.barChartLabels = []
            for (let number of result.retval.years) {
              this.barChartLabels.push(number.toString());
            }
            this.barChartData = [{data: [], label: "Income"}];
            for (let number of result.retval.sums) {
              this.barChartData[0].data.push(number);
            }
            this.setToIncomeChart();
          },
          (err) => {
            console.log(err);
          }
        )
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
