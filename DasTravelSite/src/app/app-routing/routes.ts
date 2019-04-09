import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CarsComponent} from '../cars/cars.component';
import { HotelsComponent} from '../hotels/hotels.component';
import { FlightsComponent} from '../flights/flights.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'hotels', component: HotelsComponent},
    {path: 'flights', component: FlightsComponent},
    {path: 'cars', component: CarsComponent}
];