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
import {MatNativeDateModule, MatTableModule} from '@angular/material';
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

import { UserComponent } from './user/user.component';
import { LoginServiceService } from './login-service.service';


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
    ReservecarComponent,
    UserComponent
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
    SDKBrowserModule.forRoot()
  ],
  providers: [
    {provide: 'baseURL', useValue: baseURL}, ItemService,
    LoginServiceService
  ],
  entryComponents: [
    RegisterComponent, LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
