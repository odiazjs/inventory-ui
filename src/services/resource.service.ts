import { HttpWrapper } from "../common/barrel";
import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

declare var require;
const toCamelCase = require('to-camel-case');
const toSnakeCase = require('to-snake-case');

const serializeCase = (obj) => {
  let key, keys = Object.keys(obj);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[toCamelCase(key)] = obj[key];
  }
  return newobj;
}

const serializeSnakeCase = (obj) => {
  let key, keys = Object.keys(obj);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[toSnakeCase(key)] = obj[key];
  }
  return newobj;
}

export class QueryOptions {
  public static toQueryString(paramsObject: any): string {
    return Object
      .keys(paramsObject)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
      .join('&');
  }
}

export class ResourceService<T> {
  readonly SERIALIZE_CASE = 'SERIALIZE';
  readonly DESERIALIZE_CASE = 'DESERIALIZE';
  constructor(
    private httpClient: HttpWrapper<HttpResponse<T>>,
    private baseUrl: string,
    private serializer: (value: T, serializeDirection: string) => T
  ) {
  }

  create(item: T): Observable<any> {
    Object.keys(item)
      .forEach(key => {
        if (Array.isArray(item[key])) {
          item[key] = [...item[key].map(obj => {
            return serializeSnakeCase(obj)
          })]
        } else {
          item[key] = serializeSnakeCase(item[key])
        }
      })
    return this.httpClient
      .post<T>(`${this.baseUrl}`, item)
      .pipe(
        map(item => { return this.serializer(item, this.DESERIALIZE_CASE) })
      );
  }
  update(item: any, id: number | string): Observable<T> {
    const serializedItem = this.serializer(item, this.DESERIALIZE_CASE);
    return this.httpClient
      .put<T>(`${this.baseUrl}/${id}`, serializedItem)
      .pipe(
        map(item => { return this.serializer(item, this.SERIALIZE_CASE) })
      );
  }
  getById(id: number): Observable<T> {
    return this.httpClient
      .get(`${this.baseUrl}/${id}`)
      .pipe(
        map((result: T) => { return this.serializer(result, this.SERIALIZE_CASE) })
      );
  }
  getList(paramsObject: any = {}): Observable<HttpResponse<T>> {
    return this.httpClient
      .get(`${this.baseUrl}`)
      .pipe(
        map((list: any[]) => {
          return list.map(serializeCase)
        }),
        map((httpResponse: HttpResponse<T>) => {
          return httpResponse;
        })
      );
  }
  deleteById(id: number) {
    return this.httpClient
      .delete(`${this.baseUrl}/${id}`);
  }
};