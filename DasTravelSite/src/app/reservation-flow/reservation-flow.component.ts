import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HotelApi, RoomApi, LoopBackConfig, HotelSpecialOfferApi, HotelSpecialOffer, RoomReservationApi, MyuserApi, ReservationOfferApi, RoomReservation, Room, ReservationOffer, CarApi, CarPrice, Car, CarReservationApi, CarSpecialOfferApi } from '../shared/sdk';
import { ItemService } from '../services/item.service';
import { API_VERSION } from '../shared/baseUrl';
import { Router } from '@angular/router';
import { MatSnackBar, MatTable } from '@angular/material';
import { LoginServiceService } from '../login-service.service';

@Component({
  selector: 'app-reservation-flow',
  templateUrl: './reservation-flow.component.html',
  styleUrls: ['./reservation-flow.component.scss']
})
export class ReservationFlowComponent implements OnInit {

  constructor(private fb: FormBuilder,
    @Inject('baseURL') private baseURL,
    private hotelservice: HotelApi,
    private roomservice: RoomApi,
    private _router: Router,
    private itemservice: ItemService,
    private roomreservationservice: RoomReservationApi,
    private hotelspecialofferservice: HotelSpecialOfferApi,
    private myuserservice: MyuserApi,
    private specialofferservice: HotelSpecialOfferApi,
    private reservationspecialofferservice: ReservationOfferApi,
    private loginService: LoginServiceService,
    private reservationofferservice: ReservationOfferApi,
    public snackBar: MatSnackBar,
    private reservationService: CarReservationApi,
    private carDiscountService: CarSpecialOfferApi,
    private carservice: CarApi) {
    this.createSearchRoomsForm();
    this.createSearchForm();
    LoopBackConfig.setBaseURL(baseURL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.minDate.setHours(0, 0, 0, 0);
    this.createReserveForm();

    loginService.user.subscribe(data => {
      if (data) {
        this.userType = data.user.type;
        if (this.userType === 'registeredUser') {
          this.canReserve = true;
          this.userId = data.user.id
          
        }
      }
    });
   }

  searchRoomsActive = false;
  minDate = new Date();
  searchDone = false;
  qSearchDone = false;
  reservationsInfo = [];
  foundRooms: any[];
  RoomReservationTime = false;
  room: any;
  reserveForm: FormGroup;
  availableOffers: HotelSpecialOffer[];
  userType;
  selectedOffers = [];
  foundReservations: RoomReservation[];
  roomIsReserved = false;
  specialOffersDict = {};
  columnsToDisplayReservations = ['hotel', 'roomNumber', 'beds', 'startDate', 'endDate', 'price'];
  columnsToDisplaySpecialOffers = ['name'];
  columnsToDisplaySpecialOffers1 = ['name', 'price'];
  specialOffers = [];
  selectedReservationId;
  displayQuicks = false;
  isCarSearch = false;
  searchForm: FormGroup;
  foundCars: Car[];
  CarReservationTime = false;
  car: any;
  canReserve = false;
  userId;
  carIsReserved = false;
  displayCarQuicks = false;
  foundDiscounts;
  haveCarQuicks = false;
  specialOffer;
  CarQuickReservationTime = false;
  canUseBonusPointsCar = false;
  canUseBonusPointsRoom = false;
  usingBonusPointsRoom = false;
  realPrice = 0;


  @ViewChild('tablereservations') tableReservations: MatTable<any>;
  @ViewChild('tablespecialoffers') tableSpecialOffers: MatTable<any>;
  @ViewChild('tablespecialoffers2') tableSpecialOffers2: MatTable<any>;

  switchToRoomSearch() {
    this.searchRoomsActive = true;
    this.searchDone = false;
    this.RoomReservationTime = false;
    this.qSearchDone = false;
    this.displayQuicks = false;
    this.displayCarQuicks = false;
    this.isCarSearch = false;
    this.CarReservationTime = false;
    this.onSearchQRoomsSubmit();
    this.CarQuickReservationTime = false;
    this.canUseBonusPointsCar = false;
    this.canUseBonusPointsRoom = false;
    this.usingBonusPointsRoom = false;
  }


  switchToCarSearch() {
    this.searchRoomsActive = false;
    this.searchDone = false;
    this.RoomReservationTime = false;
    this.qSearchDone = false;
    this.displayQuicks = false;
    this.displayCarQuicks = false;
    this.isCarSearch = true;
    this.CarReservationTime = false;
    this.onSearchQCarsSubmit();
    this.CarQuickReservationTime = false;
    this.canUseBonusPointsCar = false;
    this.canUseBonusPointsRoom = false;
    this.usingBonusPointsRoom = false;
  }



  searchRoomsForm: FormGroup;
  @ViewChild('fformSearchRooms') searchRoomsFormDirective;

  searchRoomsFormErrors = {
    'beds': '',
    'price': ''
  };


  searchRoomsFormValidationMessages = {
    'beds': {
      'required': 'Number of beds is required',
      'min': 'Number of beds has to be higher than 0'
    },
    'price': {
      'min': 'Price has to be higher than 0'
    }
  };

  createReserveForm() {
    this.reserveForm = this.fb.group({
      startDate: '',
      endDate: '',
      hotel: '',
      roomNumber: '',
      beds: '',
      description: '',
      price: ''
    });
  }

  toggleQuicks() {
    this.displayQuicks = !this.displayQuicks;
  }

  selectRow(id) {
    this.selectedReservationId = id;
    this.specialOffers = this.specialOffersDict[id];
  }


  //Za quick rezervaciju
  reserve() {
    let i = 0;
    let roomId = 1;
    for (const reservationInfo of this.reservationsInfo) {
      if (reservationInfo.reservation.id === this.selectedReservationId) {
        roomId = reservationInfo.room.id;
        break;
      }
      i++;
    }
    this.roomreservationservice.quickReservation(this.selectedReservationId,
      this.myuserservice.getCachedCurrent().id, roomId)
      .subscribe(reservation => {
        this.reservationsInfo.splice(i, 1);
        this.tableReservations.renderRows();
        this.openSnackBar('Reservation successful', 'Dismiss');
      }, err => {
        this.openSnackBar('Reservation failed. Please search and try again', 'Dismiss');
      });
  }


  createSearchRoomsForm() {
    this.searchRoomsForm = this.fb.group({
      startDate: [new Date('July 5, 2019 00:00:00'), [Validators.required]],
      endDate: [new Date('July 15, 2019 00:00:00'), [Validators.required]],
      beds : [0, [Validators.required, Validators.min(1)]],
      price: [0, Validators.min(1)],
      address: '',
      name: ''
    });

    this.searchRoomsForm.valueChanges
      .subscribe(data => this.onValueChangedSearchRooms(data));
    this.onValueChangedSearchRooms();
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
  }

  ngOnInit() {
  }


  updateReserveForm() {
    this.realPrice = this.room.room.price;
    this.reserveForm.reset({
      startDate: this.room.startDate.getDate() + '/' + (this.room.startDate.getMonth() + 1) + '/' + this.room.startDate.getFullYear(),
      endDate: this.room.endDate.getDate() + '/' + (this.room.endDate.getMonth() + 1) + '/' + this.room.endDate.getFullYear(),
      hotel: this.room.room.hotel,
      roomNumber: this.room.room.room.number,
      beds: this.room.room.room.beds,
      description: this.room.room.room.description,
      price: this.room.room.price
    });
  }

  onSearchRoomsSubmit() {
    const data = this.searchRoomsForm.value;
    this.itemservice.findAvailableRooms1(new Date(data.startDate), new Date(data.endDate),
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
    

    this.room = this.itemservice.getReservableRoom();
    this.updateReserveForm();
    this.hotelspecialofferservice.find({where: {hotelId: this.room.room.hotelId}})
      .subscribe((specialOffers: HotelSpecialOffer[]) => {
        this.availableOffers = specialOffers;
        this.RoomReservationTime = true;

      }, err => this.openSnackBar('Can not find special offers for this hotel', 'Dismiss'));

      if (this.itemservice.getHeader().getBonusPoints() >= 100) {
        this.canUseBonusPointsRoom = true;
      }
    
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onReserveRoomSubmit() {
    this.roomreservationservice.makeReservation(this.room.startDate.toISOString(),
      this.room.endDate.toISOString(), this.room.room.room.id,
      this.myuserservice.getCachedCurrent().id, this.room.room.price, '', this.room.room.hotelId, this.usingBonusPointsRoom)
      .subscribe(result => {
        this.openSnackBar('Reserved succesfully', 'Dismiss');
        if (this.usingBonusPointsRoom) {
          this.itemservice.getHeader().removeBonusPoints();
        }
        this.roomIsReserved = true;
        this.RoomReservationTime = false;
        this.searchDone = false;
        for (const offerId of this.selectedOffers) {
          this.reservationofferservice.create({'specialOfferId': offerId, 'roomReservationId': result.retval.id})
            .subscribe(() => console.log());
        }
      }, err => {
        this.openSnackBar('Can not reserve on this date. Please search and try again.', 'Dismiss');
      });
  }

  onSearchQRoomsSubmit() {
    this.roomreservationservice.find({where: {
        startDate: new Date('July 5, 2019 00:00:00'),
        endDate: new Date('July 15, 2019 00:00:00'),
        myuserId: null
      }}).subscribe((reservations: RoomReservation[]) => {
        this.qSearchDone = true;
        this.foundReservations = reservations;
        console.log("Quick search done");
        this.reservationsInfo = [];
        const done = new Promise((resolve, reject) => {
        let index = 0;
        if (this.foundReservations.length == 0) {
          resolve();
        }
        for (const roomReservation of this.foundReservations) {
          this.roomservice.findById(roomReservation.roomId)
            .subscribe((room: Room) => {
              this.hotelservice.findById(roomReservation.hotelId)
                .subscribe((hotel) => {
                  this.reservationsInfo.push({reservation: roomReservation, room: room, hotel: hotel});
                  this.reservationspecialofferservice.find({where: {'roomReservationId': roomReservation.id}})
                    .subscribe((reservationOfferIds: ReservationOffer[]) => {
                      const done1 = new Promise((resolve1, reject1) => {
                        if (reservationOfferIds.length === 0) {
                          resolve1();
                        }
                        let indexOffers = 0;
                        const offers = [];
                        for (const reservationOfferId of reservationOfferIds) {
                          this.specialofferservice.findById(reservationOfferId.specialOfferId)
                            .subscribe((specialOffer: HotelSpecialOffer) => {
                              offers.push(specialOffer);
                              indexOffers++;
                              if (indexOffers === reservationOfferIds.length) {
                                this.specialOffersDict[roomReservation.id] = offers;
                                resolve1();
                              }
                            });
                        }
                      });
                      done1
                        .then(() => {

                          index++;
                          if (index === this.foundReservations.length) {
                            resolve();
                          }
                        });
                    });
                }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
            }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
        }
      });
      done.then(() => {
        console.log("Actually finished");
        console.log(this.reservationsInfo);
      });
    }, err => this.openSnackBar('Something went wrong. Please try again.', 'Dismiss'));
  }

  searchFormErrors = {
    'make': '',
    'seats': '',
    'rentalService': ''
  };

  searchFormValidationMessages = {
    'make': {
      'required': 'Make is required',
      'minv': 'Start date has to be before end date',
      'ming': 'Start date has to be after today'
    },
    'seats': {
      'required': 'Seats are required',
      'pattern': 'Seats have to be a number'
    },
    'rentalService': {}
  };

  onSearchValueChanged(data?: any) {
    if (!this.searchForm) {
      return;
    }
    const form = this.searchForm;
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

    const today = new Date();
    const startDate = new Date(form.get('startDate').value);
    const endDate = new Date(form.get('endDate').value);

    if (startDate < today) {
      this.searchFormErrors['startDate'] += this.searchFormValidationMessages['startDate']['ming'] + ' ';
      this.searchForm.controls['startDate'].setErrors({'ming' : true});
    }
    if (startDate > endDate) {
      this.searchFormErrors['startDate'] += this.searchFormValidationMessages['startDate']['minv'] + ' ';
      this.searchForm.controls['startDate'].setErrors({'minv' : true});
    }
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      startDate: [new Date('July 5, 2019 00:00:00'), Validators.required],
      endDate: [new Date('July 15, 2019 00:00:00') , Validators.required],
      make: [''],
      seats: ['', Validators.pattern],
      rentalService: ['']
    });
    this.searchForm.valueChanges
      .subscribe(data => this.onSearchValueChanged(data));
    this.onSearchValueChanged();
  }


  onSearchSubmit() {

    var make = null;
    var seats = null;
    var rentalService = null;
    var startDate = new Date(this.searchForm.value.startDate).toJSON();
    var endDate = new Date(this.searchForm.value.endDate).toJSON();

    if (this.searchForm.value.make != '') {
      make = this.searchForm.value.make;
    }
    if (this.searchForm.value.seats != '') {
      seats = this.searchForm.value.seats;
    }
    if (this.searchForm.value.rentalService != '') {
      rentalService = this.searchForm.value.rentalService;
    }

    this.carservice.searchCars(startDate, endDate, make, seats, rentalService)
    .subscribe(
      (result) => {
        result = result.retval
        this.itemservice.getPrices()
        .subscribe(
          (result_prices) => {
            var result_cars = result as Car[];
            this.matchCarsAndPrices(result_cars, result_prices as CarPrice[], this.searchForm.value.startDate);
            this.foundCars = result_cars;
            if (this.foundCars.length == 0) {
              this.openSnackBar("No cars match search parameters", "Dismiss");
            }
          },
          (err) => {
            this.openSnackBar("Could not get car prices, stopping search", "Dismiss");
          }
        )
      },
      (err) => {
        }
      );
  }

  matchCarsAndPrices(cars, prices: CarPrice[], start) {
    start = new Date(start);

    for (let car of cars) {
      car.price = 0;
      car.start = new Date(0);
      for (let price of prices) {
        if (car.rentalServiceId == price.rentalServiceId) {
          if (start > price.start && car.start < price.start) {
            car.start = price.start;
            car.price = price['cat' + car.category + 'Price'];
          }
        }
      }
    }
  }

  inspect(clicked_card: any) {
    var car_id = clicked_card.path[0].id;
    for (let car of this.foundCars) {
      if (car.id == car_id) {
        (car as any).start = this.searchForm.value.startDate;
        (car as any).end = this.searchForm.value.endDate;
        this.itemservice.setReservableCar(car);
        

        var temp = this.itemservice.getReservableCar();
          if (temp) {
            this.car = temp;
            this.car.usingBonus = false;
          } else {
            this.car =  {
              'registration' : "",
              'start': 0,
              'end': 0,
              'days': 0,
              'seats': 0,
              'category': '',
              'usingBonus': false
          }
    }
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(this.car.start);
    var secondDate = new Date(this.car.end);
    this.car.days = 1 + Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    this.car.totalPrice = this.car.days * this.car.price;
    this.car.showPrice = this.car.totalPrice;
    this.CarReservationTime = true;
    if (this.itemservice.getHeader().getBonusPoints() >= 100) {
      this.canUseBonusPointsCar = true;
    }
      }
    }
  }

  inspectv2(clicked_card: any) {
    var discount_index = clicked_card.path[0].id;
    this.itemservice.setCarSpecialOffer(this.foundDiscounts[discount_index]);
    
    var temp = this.itemservice.getCarSpecialOffer();
      if (temp) {
        this.specialOffer = temp;
      } else {
        this.specialOffer = {
          'nmbr': 0,
          'registration': '',
          'endDate': '',
          'startDate': '',
          'basePrice': 0,
          'discount': 0
        }
      }

      this.CarQuickReservationTime = true;

  }


  onCarReserve() {
    this.car.registration = this.car.registration.trim();
    this.carservice.findOne({where: {"registration": this.car.registration}})
    .subscribe(
      (result) => {
        var car_result = result as Car;
        var startDate = new Date(this.car.start).toJSON();
        var endDate = new Date(this.car.end).toJSON();

        var temp_price = this.car.totalPrice;
        if (this.car.usingBonus)  {
          temp_price = Math.round(this.car.totalPrice * 0.9);
        }
        
        this.reservationService.makeReservation(startDate, endDate, car_result.id, this.userId, temp_price, car_result.rentalServiceId, this.car.usingBonus)
        .subscribe(
          (result) => {
            this.openSnackBar("Reservation successfuly made", "Dismiss");
            if (this.car.usingBonus) {
              this.itemservice.getHeader().removeBonusPoints();
            }
            this.isCarSearch = false;
            this.CarReservationTime = false;
            this.CarQuickReservationTime = false;
            this.carIsReserved = true;
          },
          (err) => {
            this.openSnackBar("Failed to make reservation", "Dismiss");
          }
        )
      },
      (err) => {
        this.openSnackBar("Car does not exist", "Dismiss");
      }
    )
  }

  homeClick() {
    this._router.navigate(['/home'])
  }


  toggleQuicksCar() {
    this.displayCarQuicks = !this.displayCarQuicks;
  }

  onSearchQCarsSubmit() {
    this.carDiscountService.find({where: {
      startDate: {
        gte: new Date('July 5, 2019 00:00:00')
      },
      endDate : {
        lte: new Date('July 15, 2019 00:00:00')
      }
    }})
    .subscribe(
      (result) => {
        var i = 0;
        for (let mini_result of result) {
          var temp = mini_result as any;
          temp.nmbr = i;
          i++;
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          temp.startDate = new Date(temp.startDate);
          temp.endDate = new Date(temp.endDate);
          temp.days = 1 + Math.round(Math.abs((temp.startDate.getTime() - temp.endDate.getTime())/(oneDay)));
          temp.startDate = temp.startDate.toLocaleDateString("en-US");
          temp.endDate = temp.endDate.toLocaleDateString("en-US");
          temp.total = temp.basePrice * temp.days;
          temp.totalDiscounted = Math.round((100 - temp.discount) / 100 * temp.total);
        }
        this.foundDiscounts = result;
        if (result.length == 0) {
          this.haveCarQuicks = false;
        } else {
          this.haveCarQuicks = true;
        }
        console.log(this.foundDiscounts);
      },
      (err) => {
        this.openSnackBar("Could not retrieve discounts", "Dismiss");
      }
    )
  }

  onQuickCarSubmit() {
    console.log(this.specialOffer);
    this.carDiscountService.quicklyReserve(this.specialOffer.carsId, this.specialOffer.id, this.userId)
    .subscribe((result) => {
      this.openSnackBar("Successfully reserved special offer", "Dismiss");
      this.isCarSearch = false;
      this.CarReservationTime = false;
      this.CarQuickReservationTime = false;
      this.carIsReserved = true;
    },
    (err) => {
      this.openSnackBar("Failed to make quick reservation", "Dismiss");
    })
  }


  toggleRow(id: number) {
    let specialOffer = null;
    for (const offer of this.availableOffers) {
      if (offer.id === id) {
        specialOffer = offer;
        break;
      }
    }
    const index = this.selectedOffers.indexOf(id);
    const price = this.reserveForm.value.price;
    if (index >= 0)  {
      this.selectedOffers.splice(index, 1);
      this.reserveForm.patchValue({'price': price - specialOffer.price});
    } else  {
      this.selectedOffers.push(id);
      this.reserveForm.patchValue({'price': price + specialOffer.price});
    }
  }

  roomCheckboxClicked() {
    if (!this.usingBonusPointsRoom) {
      this.reserveForm.patchValue({
        'price': Math.round(this.realPrice * 0.1 + this.reserveForm.value.price)}
      )
    } else {
      this.reserveForm.patchValue({
        price: Math.round(this.reserveForm.value.price - 0.1 * this.realPrice)}
      )
    }
    
  }


  carCheckboxClicked() {
    console.log("Wuhu");
    if (this.car.usingBonus) {
       this.car.showPrice = this.car.totalPrice - Math.round(this.car.totalPrice * 0.1)
    } else {
       this.car.showPrice = this.car.totalPrice;
    }
  }

}
