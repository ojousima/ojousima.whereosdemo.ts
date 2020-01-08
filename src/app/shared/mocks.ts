import { Type } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, UrlSegment, Params, Data, Route, ParamMap } from '@angular/router';

import { Observable, of } from 'rxjs';

import { ICustomer, IPagedResults } from './interfaces';

export class MockDataService {
    constructor() {}

    getCustomer(id: number): Observable<ICustomer> {
        if (id === 1) {
            return of(customers.slice(0, 1)[0]);
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
            results: customers.slice(skip, top)
        });
    }

    getCustomers(): Observable<ICustomer[]> {
        return of(customers);
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
