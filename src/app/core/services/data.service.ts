import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ICustomer, IOrder, IRuuviTag, IState, IPagedResults, IApiResponse } from '../../shared/interfaces';

@Injectable()
export class DataService {

    // Can use /api/customers and /api/orders below when running locally
    // Full domain/port is included for Docker example or if it were to run in the cloud
    //port = '8080';
    baseUrl = `${this.window.location.protocol}//${this.window.location.hostname}:${this.window.location.port}`;
    customersBaseUrl = this.baseUrl + '/api/customers';
    ordersBaseUrl = this.baseUrl + '/api/orders';
    orders: IOrder[];
    states: IState[];

    constructor(private http: HttpClient, @Inject('Window') private window: Window) { 

    }

    getCustomersPage(page: number, pageSize: number): Observable<IPagedResults<ICustomer[]>> {
        return this.http.get<IRuuviTag[]>(
            `${this.customersBaseUrl}/page/${page}/${pageSize}`,
            { observe: 'response' })
            .pipe(
                map(res => {
                    const totalRecords = +res.headers.get('X-InlineCount');
                    const ruuvitags = res.body as IRuuviTag[];
                    // this.calculateCustomersOrderTotal(customers);
                    return {
                        results: this.calculateCustomersOrderTotal(ruuvitags),
                        totalRecords: totalRecords
                    };
                }),
                catchError(this.handleError)
            );
    }

    getCustomers(): Observable<ICustomer[]> {
        return this.http.get<IRuuviTag[]>(this.customersBaseUrl)
            .pipe(
                map(ruuvitags => {
                    let customers = this.calculateCustomersOrderTotal(ruuvitags);
                    return customers;
                }),
                catchError(this.handleError)
            );
    }

    getCustomer(id: number): Observable<ICustomer> {
        return this.http.get<IRuuviTag>(this.customersBaseUrl + '/' + id)
            .pipe(
                map(ruuvitag => {
                    // this.calculateCustomersOrderTotal([customer]);
                    return this.ruuviTagToCustomer(ruuvitag);
                }),
                catchError(this.handleError)
            );
    }
/*
    insertCustomer(customer: ICustomer): Observable<ICustomer> {
        return this.http.post<ICustomer>(this.customersBaseUrl, customer)
            .pipe(catchError(this.handleError));
    }

    updateCustomer(customer: ICustomer): Observable<boolean> {
        return this.http.put<IApiResponse>(this.customersBaseUrl + '/' + customer.id, customer)
            .pipe(
                map(res => res.status),
                catchError(this.handleError)
            );
    }

    deleteCustomer(id: number): Observable<boolean> {
        return this.http.delete<IApiResponse>(this.customersBaseUrl + '/' + id)
            .pipe(
                map(res => res.status),
                catchError(this.handleError)
            );
    }
*/
    getStates(): Observable<IState[]> {
        return this.http.get<IState[]>('/api/states')
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            const errMessage = error.error.message;
            return Observable.throw(errMessage);
            // Use the following instead if using lite-server
            // return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(error || 'Node.js server error');
    }

    private parseHexString(str: string): number { 
        let result = 0;
        // Ignore any trailing single digit; I don't know what your needs
        // are for this case, so you may want to throw an error or convert
        // the lone digit depending on your needs.
        str = str.replace(/^:/, '');
         while (str.length >= 2) { 
             result *= 256;
             result += parseInt(str.substring(0, 2), 16)
             str = str.substring(2, str.length);     
        }

        return result;
    }

    calculateCustomersOrderTotal(ruuvitags: IRuuviTag[]): ICustomer[] {
        let customers: ICustomer[] = [];
        for (const ruuvitag of ruuvitags) {
            let customer = {
                id: this.parseHexString(ruuvitag.id),
                rssi: ruuvitag.rssi,
                temperature: ruuvitag.temperature,
                humidity: ruuvitag.humidity,
                location: ruuvitag.location,
                name: ruuvitag.name
            }
            customers.push(customer);
        }
        return customers;
    }

    ruuviTagToCustomer(ruuvitag: IRuuviTag): ICustomer {
        let customer = {
                id: this.parseHexString(ruuvitag.id),
                rssi: ruuvitag.rssi,
                temperature: ruuvitag.temperature,
                humidity: ruuvitag.humidity,
                location: ruuvitag.location,
                name: ruuvitag.name
        }
        return customer;
    }

    // Not using now but leaving since they show how to create
    // and work with custom observables

    // Would need following import added:
    // import { Observer } from 'rxjs';

    // createObservable(data: any): Observable<any> {
    //     return Observable.create((observer: Observer<any>) => {
    //         observer.next(data);
    //         observer.complete();
    //     });
    // }

}
