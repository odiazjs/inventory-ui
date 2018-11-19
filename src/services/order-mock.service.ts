import { Injectable } from "@angular/core";
import { Observable, pipe } from "rxjs";
import { OrderDto } from "../models/order.dto";
import { startWith, delay, map } from "rxjs/operators";

@Injectable()
export class OrderMockService {
  getList<T>(): Observable<any[]> {
    const orderList: OrderDto[] = [
      {
        id: 100001,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: 1,
        ticketNumber: "10000001"
      },
      {
        id: 100002,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: 1,
        ticketNumber: "10000002"
      },
      {
        id: 100003,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: 1,
        ticketNumber: "10000003"
      },
      {
        id: 100004,
        createdDate: "2017-05-05",
        notes: "some notes",
        orderNumber: "100001",
        orderDate: "2017-05-05",
        orderState: "Completed",
        orderType: 1,
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
