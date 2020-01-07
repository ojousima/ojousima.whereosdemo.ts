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
    "rssi": -65.80439905734485,
    "temperature": 23.895153181461087,
    "name": "coffeemachine",
    "humidity": 38.94879811468966,
    "location": "office",
    "id": 0xDAB59BDFA9BB
    }
];
