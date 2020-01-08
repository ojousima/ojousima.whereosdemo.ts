import { Type } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, UrlSegment, Params, Data, Route, ParamMap } from '@angular/router';

import { Observable, of } from 'rxjs';

import { ICustomer, IRuuviTag, IPagedResults } from './interfaces';

export class MockDataService {
    constructor() {}

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

    ruuviTagsToCustomers(ruuvitags: IRuuviTag[]): ICustomer[] {
        let customers: ICustomer[];
        for (const ruuvitag of ruuvitags) {
            let customer = {
                id: this.parseHexString(ruuvitag.id),
                rssi: ruuvitag.rssi,
                temperature: ruuvitag.temperature,
                humidity: ruuvitag.humidity,
                location: ruuvitag.location,
                name: ruuvitag.name
            }
        }
        return customers;
    }

    getCustomer(id: number): Observable<ICustomer> {
        if (id === 1) {
            return of(this.ruuviTagToCustomer(customers.slice(0, 1)[0]));
        } else {
            return of(null);
        }
    }

    getCustomersPage(page: number, pageSize: number): Observable<IPagedResults<ICustomer[]>> {
        const topVal = pageSize,
            skipVal = page,
            skip = (isNaN(skipVal)) ? 0 : +skipVal;
        let top = (isNaN(topVal)) ? 10 : skip + (+topVal);

        if (top > customers.length) {
            top = skip + (customers.length - skip);
        }

        return of({
            totalRecords: customers.length,
            results: this.ruuviTagsToCustomers(customers.slice(skip, top))
        });
    }

    getCustomers(): Observable<ICustomer[]> {
        return of(this.ruuviTagsToCustomers(customers));
    }
}

export class MockActivatedRoute implements ActivatedRoute {
    snapshot: ActivatedRouteSnapshot;
    url: Observable<UrlSegment[]>;
    params: Observable<Params>;
    queryParams: Observable<Params>;
    fragment: Observable<string>;
    data: Observable<Data>;
    outlet: string;
    component: Type<any> | string;
    routeConfig: Route;
    root: ActivatedRoute;
    parent: ActivatedRoute;
    firstChild: ActivatedRoute;
    children: ActivatedRoute[];
    pathFromRoot: ActivatedRoute[];
    paramMap: Observable<ParamMap>;
    queryParamMap: Observable<ParamMap>;
    toString(): string {
        return '';
    }
}

export function getActivatedRouteWithParent(params: any[]) {
    const route = new MockActivatedRoute();
    route.parent = new MockActivatedRoute();
    if (params) {
        for (const param of params) {
            // var keyNames = Object.keys(param);
            route.parent.params = of(param);
        }
    }

    return route;
}

export const customers = [
    {
        "rssi": -53,
        "temperature": 23.9,
        "name": "Mysterybox",
        "humidity": 26.31,
        "location": "office",
        "id": "C4:AB:0F:E2:9B:98"
    },
    {
        "rssi": -54.28680981595092,
        "temperature": 23.66819018404908,
        "name": "Teapot",
        "humidity": 31.37377300613497,
        "location": "office",
        "id": "DA:3E:ED:2B:0E:B9"
    },
    {
        "rssi": -64.51688411358404,
        "temperature": 23.077482732156515,
        "name": "coffeemachine",
        "humidity": 36.60400613967765,
        "location": "office",
        "id": "DA:B5:9B:DF:A9:BB"
    }
];
