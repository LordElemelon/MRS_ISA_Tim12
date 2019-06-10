import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {LocationApi, LoopBackConfig, Room, RoomApi, Location} from '../shared/sdk';
import { API_VERSION } from '../shared/baseUrl';
import { HotelApi } from '../shared/sdk/services';
import { Hotel } from '../shared/sdk/models/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {LoginServiceService} from '../login-service.service';
import {ItemService} from '../services/item.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {

  foundHotels: Hotel[];
  foundRooms: any[];
  locations = [];
  filteredLocations: Location[] = [];
  filteredLocationsStrings = [];
  addActive = true;
  removeActive = false;
  searchActive = false;
  searchRoomsActive = false;
  quickReservationActive = false;
  added = false;
  searchDone = false;
  userType: string;
  minDate = new Date();

  // form related objects
  hotelForm: FormGroup;
  newHotel: Hotel;
  params = {};
  @ViewChild('fformAdd') hotelFormDirective;

  searchHotelForm: FormGroup;
  searchHotelParameters: Hotel;
  hotelsFound: Hotel[];
  @ViewChild('fformSearchHotels') searchHotelFormDirective;

  searchRoomsForm: FormGroup;
  @ViewChild('fformSearchRooms') searchRoomsFormDirective;

  formErrors = {
    'name': '',
    'address': '',
    'countryCity': ''
  };

  validationMessages = {
    'name': {
      'required' : 'Hotel name is required'
    },
    'address': {
      'required' : 'Hotel address is required'
    },
    'countryCity': {
      'required': 'Location is required',
      'min': 'Location must exist'
    }
  };

  searchHotelFormErrors = {};
  searchHotelFormValidationMessages = {};

  searchRoomsFormErrors = {
    'startDate': '',
    'endDate': '',
    'beds': '',
    'price': ''
  };
  searchRoomsFormValidationMessages = {
    'startDate': {
      'required': 'Start date is required',
      'min': 'Start date has to be after today'
    },
    'endDate': {
      'required': 'End date is required',
      'min': 'End date has to be after today',
      'max': 'End date has to be after start date'
    },
    'beds': {
      'required': 'Number of beds is required',
      'min': 'Number of beds has to be higher than 0'
    },
    'price': {
      'min': 'Price has to be higher than 0'
    }
  };

  constructor(@Inject('baseURL') private baseURL,
    private hotelservice: HotelApi,
    private roomservice: RoomApi,
    private itemservice: ItemService,
    private locationsservice: LocationApi,
    private _router: Router,
    private fb: FormBuilder,
    private loginService: LoginServiceService,
    public snackBar: MatSnackBar
    ) {
      LoopBackConfig.setBaseURL(baseURL);
      LoopBackConfig.setApiVersion(API_VERSION);
      this.minDate.setHours(0, 0, 0, 0);
      this.createForm();
      this.createSearchHotelForm();
      this.createSearchRoomsForm();
    this.hotelservice.find().subscribe((hotels: Hotel[]) => this.foundHotels = hotels);
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

  ngOnInit() { }


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
    if (this.hotelForm.value.countryCity == null) return false;
    const loc = this.hotelForm.value.countryCity.split(', ');
    const city = loc[0];
    const country = loc[1];
    for (const location of this.locations){
      if (location.city === city && location.country === country) {
        return true;
      }
    }
    return false;
  }

  onValueChanged(data?: any)  {
    if (!this.hotelForm) {return; }
    const form = this.hotelForm;
    this.filteredLocations = this._filter(form.value.countryCity);
    this.fillLocationsList();
    if (!this.locationExists()) {
      this.formErrors['countryCity'] += this.validationMessages['countryCity']['min'];
      this.hotelForm.controls['countryCity'].setErrors({'min' : true});
    }
    for (const field in this.formErrors)  {
      if (this.formErrors.hasOwnProperty(field))  {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createForm() {
    this.hotelForm = this.fb.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required],
      'countryCity': ['', Validators.required],
      'description': ''
    });

    this.hotelForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    const hotel = this.hotelForm.value;
    const countryCity = hotel.countryCity.split(', ');
    let country = '';
    let city = '';
    if (countryCity.length === 2) {
      country = countryCity[1];
      city = countryCity[0];
    }
    this.newHotel = this.hotelForm.value;
    this.locationsservice.find({where: {city: city, country: country}})
      .subscribe((locations: Location[]) => {
        if (locations.length > 0) {
          const location = locations[0];
          this.newHotel.locationId = location.id;
        }
        delete this.newHotel[countryCity];
        this.hotelservice.create(this.newHotel)
          .subscribe(result =>  {
            this.hotelForm.reset({
              name: '',
              address: '',
              description: '',
              countryCity: ''
            });
            this.hotelFormDirective.resetForm();
            this.openSnackBar('Added a hotel succesfully', 'Dismiss');
          }, err =>  {
            this.openSnackBar('Can not add this hotel. Check if the name is already taken', 'Dismiss');
          });
      }, err => {
        this.openSnackBar('Can not add this hotel. Check if the name is already taken', 'Dismiss');
      });
  }


  onValueChangedSearchHotels(data?: any)  {
    if (!this.searchHotelForm) {return; }
    const form = this.searchHotelForm;
    for (const field in this.searchHotelFormErrors)  {
      if (this.searchHotelFormErrors.hasOwnProperty(field))  {
        this.searchHotelFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.searchHotelFormValidationMessages[field];
          for (const key in control.errors)  {
            if (control.errors.hasOwnProperty(key))  {
              this.searchHotelFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  createSearchHotelForm() {
    this.searchHotelForm = this.fb.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required]
    });

    this.searchHotelForm.valueChanges
      .subscribe(data => this.onValueChangedSearchHotels(data));
    this.onValueChangedSearchHotels();
  }

  onSearchHotelsSubmit() {
    this.searchHotelParameters = this.searchHotelForm.value;
    this.params = {};
    if (this.searchHotelParameters.name != '' && this.searchHotelParameters.name != undefined){
      this.params['name'] = this.searchHotelParameters.name;
    }
    if (this.searchHotelParameters.address != '' && this.searchHotelParameters.address != undefined){
      this.params['address'] = this.searchHotelParameters.address;
    }
    if (this.params !== {})  {
      this.hotelservice.find({where : this.params})
      .subscribe((result: Hotel[]) =>  {
        this.hotelsFound = result;
      }, err => {
        this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
      });
    } else{
      this.hotelservice.find()
      .subscribe((result: Hotel[]) =>  {
        this.hotelsFound = result;
      }, err => {
        this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
      });
    }
  }

  onValueChangedSearchRooms(data?: any)  {
    if (!this.searchRoomsForm) {return; }
    const form = this.searchRoomsForm;
    for (const field in this.searchRoomsFormErrors) {
      if (this.searchRoomsFormErrors.hasOwnProperty(field)) {
        this.searchRoomsFormErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = this.searchRoomsFormValidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.searchRoomsFormErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
    const startDate = form.get('startDate').value;
    const endDate = form.get('endDate').value;
    if (startDate < this.minDate) {
      this.searchRoomsFormErrors['startDate'] += this.searchRoomsFormValidationMessages['startDate']['min'] + ' ';
      this.searchRoomsForm.controls['startDate'].setErrors({'min' : true});
    }
    if (endDate < this.minDate) {
      this.searchRoomsFormErrors['endDate'] += this.searchRoomsFormValidationMessages['endDate']['min'] + ' ';
      this.searchRoomsForm.controls['endDate'].setErrors({'min' : true});
    }
    if (endDate <= startDate)  {
      this.searchRoomsFormErrors['endDate'] += this.searchRoomsFormValidationMessages['endDate']['max'] + ' ';
      this.searchRoomsForm.controls['endDate'].setErrors({'max' : true});
    }
  }

  createSearchRoomsForm() {
    this.searchRoomsForm = this.fb.group({
      startDate: [this.minDate, [Validators.required]],
      endDate: [this.minDate, [Validators.required]],
      beds : [0, [Validators.required, Validators.min(1)]],
      price: [0, Validators.min(1)],
      address: '',
      name: ''
    });

    this.searchRoomsForm.valueChanges
      .subscribe(data => this.onValueChangedSearchRooms(data));
    this.onValueChangedSearchRooms();
  }

  onSearchRoomsSubmit() {
    const data = this.searchRoomsForm.value;
    this.roomservice.findAvailableRooms(new Date(data.startDate).toISOString(), new Date(data.endDate).toISOString(),
      data.address, data.price, data.beds)
      .subscribe(result => {
        this.foundRooms = result.retval;
        this.searchDone = true;
        this.searchRoomsActive = false;
      }, err => {
        this.openSnackBar('Something went wrong. Please try again', 'Dismiss');
      });
  }

  clickRoom(index: number) {
    this.itemservice.setReservableRoom({'room': this.foundRooms[index],
    'startDate': this.searchRoomsForm.value.startDate,
    'endDate': this.searchRoomsForm.value.endDate});

    this._router.navigate(['/roomreservation']);
  }

  addButton()  {
    this.addActive = true;
    this.removeActive = false;
    this.searchActive = false;
    this.searchRoomsActive = false;
    this.searchDone = false;
    this.quickReservationActive = false;
  }

  removeButton()  {
    this.addActive = false;
    this.removeActive = true;
    this.searchActive = false;
    this.searchRoomsActive = false;
    this.searchDone = false;
    this.quickReservationActive = false;
  }

  searchButton()  {
    this.addActive = false;
    this.removeActive = false;
    this.searchActive = true;
    this.searchRoomsActive = false;
    this.searchDone = false;
    this.quickReservationActive = false;
  }

  searchRoomsButton()  {
    this.addActive = false;
    this.removeActive = false;
    this.searchActive = false;
    this.searchRoomsActive = true;
    this.searchDone = false;
    this.quickReservationActive = false;
  }

  quickReservationButton() {
    this.addActive = false;
    this.removeActive = false;
    this.searchActive = false;
    this.searchRoomsActive = false;
    this.searchDone = false;
    this.quickReservationActive = true;
  }

}
