/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { ErrorHandler } from '../core/error.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarReservation } from '../../models/CarReservation';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `CarReservation` model.
 */
@Injectable()
export class CarReservationApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, errorHandler);
  }

  /**
   * Patch an existing model instance or insert a new one into the data source.
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - Model instance data
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CarReservation` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id carReservation id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CarReservation` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   *  - `startDate` – `{date}` - 
   *
   *  - `endDate` – `{date}` - 
   *
   *  - `carId` – `{string}` - 
   *
   *  - `userId` – `{string}` - 
   *
   *  - `price` – `{number}` - 
   *
   *  - `rentalid` – `{string}` - 
   *
   *  - `usePoints` – `{boolean}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public makeReservation(startDate: any, endDate: any, carId: any, userId: any, price: any, rentalid: any, usePoints: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/makeReservation";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof carId !== 'undefined' && carId !== null) _urlParams.carId = carId;
    if (typeof userId !== 'undefined' && userId !== null) _urlParams.userId = userId;
    if (typeof price !== 'undefined' && price !== null) _urlParams.price = price;
    if (typeof rentalid !== 'undefined' && rentalid !== null) _urlParams.rentalid = rentalid;
    if (typeof usePoints !== 'undefined' && usePoints !== null) _urlParams.usePoints = usePoints;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   *  - `id` – `{number}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public cancel(id: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/cancel";
    let _routeParams: any = {

    };
    let _postBody: any = {};
	let _urlParams: any = { id: id };
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   *  - `id` – `{number}` - 
   *
   *  - `carRate` – `{number}` - 
   *
   *  - `rentalRate` – `{number}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public rateServiceAndCar(id: any, carRate: any, rentalRate: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/rateServiceAndCar";
    let _routeParams: any = {

    };
    let _postBody: any = {};
	let _urlParams: any = { id: id };
    if (typeof carRate !== 'undefined' && carRate !== null) _urlParams.carRate = carRate;
    if (typeof rentalRate !== 'undefined' && rentalRate !== null) _urlParams.rentalRate = rentalRate;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {date} startDate 
   *
   * @param {date} endDate 
   *
   * @param {string} rentalServiceId 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public getYearlyReport(startDate: any, endDate: any, rentalServiceId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/getYearlyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof rentalServiceId !== 'undefined' && rentalServiceId !== null) _urlParams.rentalServiceId = rentalServiceId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   *  - `startDate` – `{date}` - 
   *
   *  - `endDate` – `{date}` - 
   *
   *  - `rentalServiceId` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{objects}` - 
   */
  public getMonthlyReport(startDate: any, endDate: any, rentalServiceId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/getMonthlyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof rentalServiceId !== 'undefined' && rentalServiceId !== null) _urlParams.rentalServiceId = rentalServiceId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {object} data Request data.
   *
   *  - `startDate` – `{date}` - 
   *
   *  - `endDate` – `{date}` - 
   *
   *  - `rentalServiceId` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{objects}` - 
   */
  public getWeeklyReport(startDate: any, endDate: any, rentalServiceId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/getWeeklyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof rentalServiceId !== 'undefined' && rentalServiceId !== null) _urlParams.rentalServiceId = rentalServiceId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {date} startDate 
   *
   * @param {date} endDate 
   *
   * @param {string} rentalServiceId 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{objects}` - 
   */
  public getOccupancyReport(startDate: any, endDate: any, rentalServiceId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/getOccupancyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof rentalServiceId !== 'undefined' && rentalServiceId !== null) _urlParams.rentalServiceId = rentalServiceId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} rentalServiceId 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{objects}` - 
   */
  public getRatingReport(rentalServiceId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/carReservations/getRatingReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof rentalServiceId !== 'undefined' && rentalServiceId !== null) _urlParams.rentalServiceId = rentalServiceId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `CarReservation`.
   */
  public getModelName() {
    return "CarReservation";
  }
}
