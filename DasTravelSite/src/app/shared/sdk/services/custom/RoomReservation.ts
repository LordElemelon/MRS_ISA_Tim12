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
import { RoomReservation } from '../../models/RoomReservation';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `RoomReservation` model.
 */
@Injectable()
export class RoomReservationApi extends BaseLoopBackApi {

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
   * This usually means the response is a `RoomReservation` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations";
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
   * @param {any} id roomReservation id
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
   * This usually means the response is a `RoomReservation` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/:id";
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
   *  - `roomId` – `{string}` - 
   *
   *  - `userId` – `{string}` - 
   *
   *  - `price` – `{number}` - 
   *
   *  - `hotelDiscountId` – `{string}` - 
   *
   *  - `hotelId` – `{string}` - 
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
public makeReservation(startDate: any, endDate: any, roomId: any, userId: any = '', price: any, hotelDiscountId: any = '', hotelId: any, usePoints: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/makeReservation";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof roomId !== 'undefined' && roomId !== null) _urlParams.roomId = roomId;
    if (typeof userId !== 'undefined' && userId !== null) _urlParams.userId = userId;
    if (typeof price !== 'undefined' && price !== null) _urlParams.price = price;
    if (typeof hotelDiscountId !== 'undefined' && hotelDiscountId !== null) _urlParams.hotelDiscountId = hotelDiscountId;
    if (typeof hotelId !== 'undefined' && hotelId !== null) _urlParams.hotelId = hotelId;
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
   *  - `reservationId` – `{number}` - 
   *
   *  - `myuserId` – `{string}` - 
   *
   *  - `roomId` – `{string}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public quickReservation(reservationId: any, myuserId: any, roomId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/quickReservation";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof reservationId !== 'undefined' && reservationId !== null) _urlParams.reservationId = reservationId;
    if (typeof myuserId !== 'undefined' && myuserId !== null) _urlParams.myuserId = myuserId;
    if (typeof roomId !== 'undefined' && roomId !== null) _urlParams.roomId = roomId;
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
    "/roomReservations/cancel";
    let _routeParams: any = {

    };
    let _postBody: any = {};
		let _urlParams: any = { id: id};
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
   *  - `roomRate` – `{number}` - 
   *
   *  - `hotelRate` – `{number}` - 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public rateHotelAndRoom(id: any, roomRate: any, hotelRate: any, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/rateHotelAndRoom";
    let _routeParams: any = {

    };
    let _postBody: any = {};
	let _urlParams: any = { id: id };
    if (typeof roomRate !== 'undefined' && roomRate !== null) _urlParams.roomRate = roomRate;
    if (typeof hotelRate !== 'undefined' && hotelRate !== null) _urlParams.hotelRate = hotelRate;
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
   * @param {string} hotelId 
   *
   * @param {number} type 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public getYearlyReport(startDate: any, endDate: any, hotelId: any, type: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/getYearlyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof hotelId !== 'undefined' && hotelId !== null) _urlParams.hotelId = hotelId;
    if (typeof type !== 'undefined' && type !== null) _urlParams.type = type;
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
   * @param {string} hotelId 
   *
   * @param {number} type 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public getMonthlyReport(startDate: any, endDate: any, hotelId: any, type: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/getMonthlyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof hotelId !== 'undefined' && hotelId !== null) _urlParams.hotelId = hotelId;
    if (typeof type !== 'undefined' && type !== null) _urlParams.type = type;
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
   * @param {string} hotelId 
   *
   * @param {number} type 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{object}` - 
   */
  public getWeeklyReport(startDate: any, endDate: any, hotelId: any, type: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/getWeeklyReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof startDate !== 'undefined' && startDate !== null) _urlParams.startDate = startDate;
    if (typeof endDate !== 'undefined' && endDate !== null) _urlParams.endDate = endDate;
    if (typeof hotelId !== 'undefined' && hotelId !== null) _urlParams.hotelId = hotelId;
    if (typeof type !== 'undefined' && type !== null) _urlParams.type = type;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} hotelId 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `retval` – `{objects}` - 
   */
  public getRatingReport(hotelId: any, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/roomReservations/getRatingReport";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof hotelId !== 'undefined' && hotelId !== null) _urlParams.hotelId = hotelId;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `RoomReservation`.
   */
  public getModelName() {
    return "RoomReservation";
  }
}
