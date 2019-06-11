import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location, LocationApi, LoopBackConfig} from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { RentalServiceApi } from '../shared/sdk/services';
import { RentalService } from '../shared/sdk/models/RentalService';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoginServiceService} from '../login-service.service';
import { ItemService } from '../services/item.service';
import {count} from 'rxjs/operators';
import {RegisterComponent} from '../register/register.component';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-rentalservices',
  templateUrl: './rentalservices.component.html',
  styleUrls: ['./rentalservices.component.scss']
})
export class RentalservicesComponent implements OnInit {
  userType: string;
  addForm: FormGroup;
  toAddService: RentalService;
  @ViewChild('addform') addFormDirective;

  removeForm: FormGroup;
  @ViewChild('removeform') removeFormDirective;

  changeForm: FormGroup;
  @ViewChild('changeform') changeFormDirective;
  toChangeService: RentalService;

  searchForm: FormGroup;
  @ViewChild('searchform') searchFormDirective;

  isAdd: boolean;

  isRemove: boolean;

  isChange: boolean;

  isSearch: boolean;
  foundServices: RentalService[];

  islist: boolean;

  locations = [];
  filteredLocations: Location[] = [];
  filteredLocationsStrings = [];

  constructor(@Inject('baseURL') private baseURL,
    private rentalServiceService: RentalServiceApi,
    private loginService: LoginServiceService,
    private locationsservice: LocationApi,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private itemService: ItemService) { 
      /*
        Force initialization
      */
      this.itemService.getServiceId();

      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.createAddForm();
      this.createRemoveForm();
      this.createSearchForm();
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
    if (this.addForm.value.countryCity == null) return false;
    const loc = this.addForm.value.countryCity.split(', ');
    const city = loc[0];
    const country = loc[1];
    for (const location of this.locations) {
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

  setToAdd() {
    this.isAdd = true;
    this.isRemove = null;
    this.isChange = null;
    this.isSearch = null;
    this.islist = null;
  }

  setToRemove() {
    this.isAdd = null;
    this.isRemove = true;
    this.isChange = null;
    this.isSearch = null;
    this.islist = null;
  }

  setToChange() {
    this.isAdd = null;
    this.isRemove = null;
    this.isChange = true;
    this.isSearch = null;
    this.islist = null;
  }

  setToSearch() {
    this.isAdd = null;
    this.isRemove = null;
    this.isChange = null;
    this.isSearch = true;
    this.islist = null;
  }

  setToList() {
    this.isAdd = null;
    this.isRemove = null;
    this.isChange = null;
    this.isSearch = null;
    this.islist = true;
  }

  addFormErrors = {
    'name': '',
    'address': '',
    'description': '',
    'countryCity': ''
  };

  addFormValidationMessages = {
    'name': {
      'required': 'Name is required'
    },
    'address': {
      'required': 'Address is required'
    },
    'description': {
      'required': 'Description is required'
    },
    'countryCity': {
      'required': 'Location is required',
      'min': 'Location must exist'
    }
  };

  onAddValueChanged(data?:any) {
    if (!this.addForm) { return; }
    const form = this.addForm;
    this.filteredLocations = this._filter(form.value.countryCity);
    this.fillLocationsList();
    if (!this.locationExists()) {
      this.addFormErrors['countryCity'] += this.addFormValidationMessages['countryCity']['min'];
      this.addForm.controls['countryCity'].setErrors({'min' : true});
    }
    for (const field in this.addFormErrors) {
      if (this.addFormErrors.hasOwnProperty(field)) {
        // clear previous error message
        this.addFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.addFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.addFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createAddForm() {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      countryCity: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.addForm.valueChanges
      .subscribe(data => this.onAddValueChanged(data));
    this.onAddValueChanged();
  }

  onAddSubmit() {
    const loc = this.addForm.value.countryCity.split(', ');
    this.toAddService = this.addForm.value;
    let country = '';
    let city = '';
    if (loc.length === 2) {
      country = loc[1];
      city = loc[0];
    }
    this.locationsservice.find({where: {city: city, country: country}})
      .subscribe((locations: Location[]) => {
        if (locations.length > 0) {
          const location = locations[0];
          this.toAddService.locationId = location.id;
        }
        delete this.toAddService['countryCity'];
        this.toAddService.myuserId = '';
        this.rentalServiceService.create(this.toAddService)
          .subscribe(
            (result) => {
              this.openSnackBar("Adding succeded", "Dismiss");
            },
            (err) => {
              this.openSnackBar("Adding failed", "Dimsiss");
            });
        this.addForm.reset({
          name: '',
          address: '',
          description: '',
          countryCity: ''
        });
        this.addFormDirective.resetForm();
      }, (err) => {
       this.openSnackBar('Adding failed', 'Dismiss');
    });
  }

  removeFormErrors = {
    'name': ''
  }

  removeFormValidationMessages = {
    'name': {
      'required': 'Name is required in order to remove a rental service'
    }
  }


  onRemoveValueChanged(data?:any) {
    if (!this.removeForm) { return; }
    const form = this.removeForm;
    for (const field in this.removeFormErrors) {
      if (this.removeFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.removeFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.removeFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.removeFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createRemoveForm() {
    this.removeForm = this.fb.group({
      name: ['', Validators.required]
    });
    this.removeForm.valueChanges
    .subscribe((data) => this.onRemoveValueChanged(data));
    this.onRemoveValueChanged();
  }

  onRemoveSubmit() {
    //{"where":{"name": "string"}}
    this.rentalServiceService.findOne({'where': {'name': this.removeForm.value.name}})
    .subscribe((rentalService) => {
      var myRentalService = rentalService as RentalService
      if (rentalService != null) {
        this.rentalServiceService.deleteById(myRentalService.id)
        .subscribe(
        (deletedRentalService) => {
          this.openSnackBar("Deletion successfull", "Dismiss");
          this.removeForm.reset({
            name: ''
          });
          this.removeFormDirective.resetForm();
        },
        (err) => {
          this.openSnackBar("Deletion failed", "Dismiss");
        });
      }
    },
    (err) => {
      this.openSnackBar("Deletion failed", "Dismiss");
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      name: [''],
      countryCity: ['']
    })
    this.searchForm.valueChanges
    .subscribe(data => this.onSearchValueChanged(data));
    this.onSearchValueChanged();
  }

  searchFormErrors = {
    'startDate': '',
    'endDate': '',
    'countryCity': ''
  };

  searchFormValidationMessages = {
    'startDate': {
      'required': 'Start date is required for search'
    },
    'endDate': {
      'required': 'End date is required for search'
    },
    'countryCity': {}
  };

  onSearchValueChanged(data?:any) {
    if (!this.searchForm) { return; }
    const form = this.searchForm;
    this.filteredLocations = this._filter(form.value.countryCity);
    this.fillLocationsList();
    for (const field in this.searchFormErrors) {
      if (this.searchFormErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.searchFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.searchFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.searchFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSearchSubmit() {
    var name = null;
    var address = null;
    if (this.searchForm.value.name != '') {
      name = this.searchForm.value.name
    }
    if (this.searchForm.value.address != '') {
      address = this.searchForm.value.address
    }

    var startDate = new Date(this.searchForm.value.startDate).toJSON();
    var endDate = new Date(this.searchForm.value.endDate).toJSON();
    const cityCountry = this.getCityCountry(this.searchForm.value.countryCity);
    const city = cityCountry[0];
    const country = cityCountry[1];

    // these two values will change once we actually have resrvations
    this.rentalServiceService.getAvailableServices(startDate,
      endDate, name, null)
    .subscribe((result) => {
      this.foundServices = [];
      if (city === '') {
        this.foundServices = result.retval as RentalService[];
      } else {
        for (const rac of result.retval) {
          this.locationsservice.findById(rac.locationId)
            .subscribe((res: Location) => {
              if (res.city === city && res.country === country) {
                this.foundServices.push(rac);
              }
            }, err => {
              this.openSnackBar('Something went wrong. Please try again', 'Dismiss')
            });

        }
        this.openSnackBar('Search done', 'Dismiss');
      }
    },
    (err) => {
      this.openSnackBar("Search failed", "Dismiss");
    });
  }

  openMap(service) {
    this.dialog.open(MapComponent, {width: '80%', height: '80%', data: {lat: service.latitude, lng: service.longitude}});
  }
}
