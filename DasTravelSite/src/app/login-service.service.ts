import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Myuser} from './shared/sdk/models';


@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  observableUser = new BehaviorSubject<any>(null);
  public user: Observable<any>;
  constructor() {
    this.user = this.observableUser.asObservable();
  }
}
