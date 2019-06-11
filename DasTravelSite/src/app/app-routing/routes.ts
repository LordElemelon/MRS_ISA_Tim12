import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CarsComponent} from '../cars/cars.component';
import { HotelsComponent} from '../hotels/hotels.component';
import { FlightsComponent} from '../flights/flights.component';
import { RentalservicesComponent } from '../rentalservices/rentalservices.component';
import { BranchesComponent } from '../branches/branches.component';
import { HotelComponent } from '../hotel/hotel.component';
import { AirlineComponent } from "../airline/airline.component";
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { RoomComponent } from '../room/room.component';
import { CarpricesComponent } from  '../carprices/carprices.component';
import { ReservecarComponent } from '../reservecar/reservecar.component';
import { ReserveRoomComponent } from '../reserve-room/reserve-room.component';
import { UserComponent } from  '../user/user.component';
import {RoomReservationListComponent} from '../room-reservation-list/room-reservation-list.component';
import { CarDiscountsComponent } from '../car-discounts/car-discounts.component';
import {CarReservationListComponent} from '../car-reservation-list/car-reservation-list.component';
import { CarBusinessReportsComponent } from '../car-business-reports/car-business-reports.component';
import { ListCarDiscountsComponent } from '../list-car-discounts/list-car-discounts.component';
import { ReserveCarSpecialComponent } from '../reserve-car-special/reserve-car-special.component';
import { RoomBusinessReportsComponent } from '../room-business-reports/room-business-reports.component';
import { ReservationFlowComponent } from '../reservation-flow/reservation-flow.component';
import {LocationsComponent} from '../locations/locations.component';
import {MapComponent} from '../map/map.component';
import {AirlinesSysAdminComponent} from '../airlines-sys-admin/airlines-sys-admin.component';
import {AdminsComponent} from '../admins/admins.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'hotels', component: HotelsComponent},
  {path: 'flights', component: FlightsComponent},
  {path: 'cars', component: CarsComponent},
  {path: 'rentalServices', component: RentalservicesComponent},
  {path: 'branches', component: BranchesComponent},
  {path: 'hotel', component: HotelComponent},
  {path: 'airline', component: AirlineComponent},
  {path: 'rooms', component: RoomsListComponent},
  {path: 'room/:id', component: RoomComponent},
  {path: 'carPrices', component: CarpricesComponent},
  {path: 'carDiscounts', component: CarDiscountsComponent},
  {path: 'carreservation', component: ReservecarComponent},
  {path: 'roomreservation', component: ReserveRoomComponent},
  {path: 'user', component: UserComponent},
  {path: 'roomReservations', component: RoomReservationListComponent},
  {path: 'carReservations', component: CarReservationListComponent},
  {path: 'carBusinessReports', component: CarBusinessReportsComponent},
  {path: 'listCarDiscounts', component: ListCarDiscountsComponent},
  {path: 'reserveCarSpecial', component: ReserveCarSpecialComponent},
  {path: 'roomBusinessReports', component: RoomBusinessReportsComponent},
  {path: 'reservationFlow', component: ReservationFlowComponent},
  {path: 'locations', component: LocationsComponent},
  {path: 'maps', component: MapComponent},
  {path: 'addAirline', component: AirlinesSysAdminComponent},
  {path: 'admins', component: AdminsComponent}
];
