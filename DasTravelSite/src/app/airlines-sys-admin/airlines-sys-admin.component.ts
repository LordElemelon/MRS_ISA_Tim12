import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginServiceService} from '../login-service.service';
import {Location} from '../shared/sdk/models';
import {MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AirlineApi, LocationApi} from '../shared/sdk/services/custom';

@Component({
  selector: 'app-airlines-sys-admin',
  templateUrl: './airlines-sys-admin.component.html',
  styleUrls: ['./airlines-sys-admin.component.scss']
})
export class AirlinesSysAdminComponent implements OnInit {
  userType: string;
  addActive = true;
  locations = [];
  filteredLocations: Location[] = [];
  filteredLocationsStrings = [];
  addAirlineForm: FormGroup;
  @ViewChild('fformAddAirline') addAirlineFormDirective;

  addAirlineFormErrors = {
    'name': '',
    'address': '',
    'countryCity': ''
  };
  addAirlineFormValidationMessages = {
    'name': {
      'required' : 'Airline name is required'
    },
    'address': {
      'required' : 'Airline address is required'
    },
    'countryCity': {
      'required': 'Location is required',
      'min': 'Location must exist'
    }
  };


  constructor(
    private locationsservice: LocationApi,
    private loginService: LoginServiceService,
    private snackBar: MatSnackBar,
    private airlineservice: AirlineApi,
    private fb: FormBuilder
    ) {
    this.locationsservice.find().subscribe((locations: Location[]) => {
        this.locations = locations;
        this.filteredLocations = this.locations;
        this.fillLocationsList();
      }
    );
    this.loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
      }
    });
    this.createAddAirlineForm();
  }

  ngOnInit() {
  }

  private _filter(value: string): Location[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.locations.filter(location => (location.city.toLowerCase() + ', ' + location.country.toLowerCase()).includes(filterValue));
    } else {
      return this.locations;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  fillLocationsList() {
    this.filteredLocationsStrings = [];
    for (const location of this.filteredLocations) {
      this.filteredLocationsStrings.push(location.city + ', ' + location.country);
    }
  }

  locationExists() {
    if (this.addAirlineForm.value.countryCity == null) return false;
    const loc = this.addAirlineForm.value.countryCity.split(', ');
    if (loc.length !== 2) return false;
    const city = loc[0];
    const country = loc[1];
    for (const location of this.locations){
      if (location.city === city && location.country === country) {
        return true;
      }
    }
    return false;
  }

  getCityCountry(countryCity) {
    countryCity = countryCity.split(', ');
    if (countryCity.length !== 2) return ['', ''];
    return [countryCity[0], countryCity[1]];
  }

  onAddAirlineValueChanged(data?: any)  {
    if (!this.addAirlineForm) {return; }
    const form = this.addAirlineForm;
    this.filteredLocations = this._filter(form.value.countryCity);
    this.fillLocationsList();
    if (!this.locationExists()) {
      this.addAirlineFormErrors['countryCity'] += this.addAirlineFormValidationMessages['countryCity']['min'];
      this.addAirlineForm.controls['countryCity'].setErrors({'min' : true});
    }
    for (const field in this.addAirlineFormErrors)  {
      if (this.addAirlineFormErrors.hasOwnProperty(field))  {
        this.addAirlineFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addAirlineFormValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.addAirlineFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddAirlineForm() {
    this.addAirlineForm = this.fb.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required],
      'countryCity': ['', Validators.required],
      'description': ''
    });
    this.addAirlineForm.valueChanges
      .subscribe(data => this.onAddAirlineValueChanged(data));
    this.onAddAirlineValueChanged();
  }

  onAddAirlineSubmit() {
    const airline = this.addAirlineForm.value;
    const countryCity = airline.countryCity.split(', ');
    let country = '';
    let city = '';
    if (countryCity.length === 2) {
      country = countryCity[1];
      city = countryCity[0];
    }
    this.locationsservice.find({where: {city: city, country: country}})
      .subscribe((locations: Location[]) => {
        if (locations.length > 0) {
          const location = locations[0];
          airline.locationId = location.id;
        }
        delete airline['countryCity'];
        airline.myuserId = '';
        this.airlineservice.create(airline)
          .subscribe(result => {
            this.addAirlineForm.reset({
              name: '',
              address: '',
              description: '',
              countryCity: ''
            });
            this.addAirlineFormDirective.resetForm();
            this.openSnackBar('Added an airline succesfully', 'Dismiss');

          }, err => this.openSnackBar('Can not add this airline. Check if the name is already taken', 'Dismiss'));
      }, err => this.openSnackBar('Can not add this airline. Check if the name is already taken', 'Dismiss'));
  }

  addButton() {
    this.addActive = true;
  }
}
