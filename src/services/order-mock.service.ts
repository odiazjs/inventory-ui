import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { startWith, delay, map } from "rxjs/operators";

@Injectable()
export class OrderMockService {
  getList<T>(): Observable<any[]> {
    const orderList: any[] = [
      {
        id: 100001,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: {id: 1, name: 'Buy'},
        ticketNumber: "10000001"
      },
      {
        id: 100002,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: {id: 1, name: 'Buy'},
        ticketNumber: "10000002"
      },
      {
        id: 100003,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: {id: 1, name: 'Buy'},
        ticketNumber: "10000003"
      },
      {
        id: 100004,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: {id: 1, name: 'Buy'},
        ticketNumber: "10000004"
      }
    ];
    return Observable.of()
      .pipe(
        startWith(null),
        delay(2000),
        map(() => {
            return orderList;
        })
      )
  }
}
