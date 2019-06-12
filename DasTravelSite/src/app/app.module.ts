import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule} from '@angular/material/select';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FlightsComponent } from './flights/flights.component';
import { HotelsComponent } from './hotels/hotels.component';
import { CarsComponent } from './cars/cars.component';
import { SDKBrowserModule } from './shared/sdk';
import { baseURL } from './shared/baseUrl';
import { MatSnackBarModule } from '@angular/material';

import { ChartsModule } from 'ng2-charts';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RentalservicesComponent } from './rentalservices/rentalservices.component';
import { BranchesComponent } from './branches/branches.component';
import { HotelApi } from './shared/sdk/services/custom/Hotel';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HotelComponent } from './hotel/hotel.component';
import { AirlineComponent } from './airline/airline.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { RoomComponent } from './room/room.component';
import { CarpricesComponent } from './carprices/carprices.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReservecarComponent } from './reservecar/reservecar.component';
import { ItemService } from './services/item.service';

import { LoginServiceService } from './login-service.service';
import { ListallservicesComponent } from './listallservices/listallservices.component';
import { CarDiscountsComponent } from './car-discounts/car-discounts.component';
import { ReserveRoomComponent } from './reserve-room/reserve-room.component';
import { UserComponent } from './user/user.component';
import { ListCarDiscountsComponent } from './list-car-discounts/list-car-discounts.component';
import { RoomReservationListComponent } from './room-reservation-list/room-reservation-list.component';
import { CarReservationListComponent } from './car-reservation-list/car-reservation-list.component';
import { CarBusinessReportsComponent } from './car-business-reports/car-business-reports.component';
import { ReserveSeatComponent } from './reserve-seat/reserve-seat.component';
import { AirlinesComponent } from './airlines/airlines.component';
import { RoomQuickReservationComponent } from './room-quick-reservation/room-quick-reservation.component';
import { ReserveCarSpecialComponent } from './reserve-car-special/reserve-car-special.component';
import { FriendsComponent } from './friends/friends.component';
import { RateCarAndServiceComponent } from './rate-car-and-service/rate-car-and-service.component';
import { RateRoomAndHotelComponent } from './rate-room-and-hotel/rate-room-and-hotel.component';
import { ChangeRentalServiceComponent } from './change-rental-service/change-rental-service.component';
import { ListBranchesComponent } from './list-branches/list-branches.component';
import { ListCarsAdminComponent } from './list-cars-admin/list-cars-admin.component';
import { RoomBusinessReportsComponent } from './room-business-reports/room-business-reports.component';
import { ReservationFlowComponent } from './reservation-flow/reservation-flow.component';
import { LocationsComponent } from './locations/locations.component';
import { MapComponent } from './map/map.component';
import {AgmCoreModule} from '@agm/core';
import { AirlinesSysAdminComponent } from './airlines-sys-admin/airlines-sys-admin.component';
import { AdminsComponent } from './admins/admins.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FlightsComponent,
    HotelsComponent,
    CarsComponent,
    RentalservicesComponent,
    BranchesComponent,
    HotelComponent,
    AirlineComponent,
    RoomsListComponent,
    RoomComponent,
    CarpricesComponent,
    RegisterComponent,
    LoginComponent,
    ListallservicesComponent,
    CarDiscountsComponent,
    ReservecarComponent,
    ReserveRoomComponent,
    UserComponent,
    ListCarDiscountsComponent,
    RoomReservationListComponent,
    CarReservationListComponent,
    ReserveSeatComponent,
    AirlinesComponent,
    CarBusinessReportsComponent,
    ReserveSeatComponent,
    RoomQuickReservationComponent,
    FriendsComponent,
    ChangeRentalServiceComponent,
    ListBranchesComponent,
    ListCarsAdminComponent,
    ReserveCarSpecialComponent,
    FriendsComponent,
    RateCarAndServiceComponent,
    RateRoomAndHotelComponent,
    RoomBusinessReportsComponent,
    ReservationFlowComponent,
    LocationsComponent,
    MapComponent,
    AirlinesSysAdminComponent,
    AdminsComponent
  ],
  imports: [
    BrowserModule,
    MatSnackBarModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartsModule,
    SDKBrowserModule.forRoot(),
    MatAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCS7Tj-OtjMMBnoW_d28O4VoYgt1-3MHGM'
    })
  ],
  providers: [
    {provide: 'baseURL', useValue: baseURL}, ItemService,
    LoginServiceService
  ],
  entryComponents: [
    RegisterComponent, LoginComponent, RateCarAndServiceComponent, RateRoomAndHotelComponent, MapComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
