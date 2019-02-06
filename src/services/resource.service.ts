import { HttpWrapper } from "../common/barrel";
import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

declare var require;
const toCamelCase = require('to-camel-case');
const toSnakeCase = require('to-snake-case');

export const serializeCase = (obj) => {
  let key, keys = Object.keys(obj);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[toCamelCase(key)] = obj[key];
  }
  return newobj;
}

export const deserializeCase = (obj): any => {
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
    public httpClient: HttpWrapper<HttpResponse<T>>,
    public baseUrl: string,
    private serializer: (value: any, serializeDirection?: string) => any
  ) {
  }

  create(item: T): Observable<any> {
    if (typeof item === 'object') {
      Object.keys(item)
        .forEach(key => {
          if (Array.isArray(item[key])) {
            item[key] = [...item[key].map(obj => {
              return deserializeCase(obj)
            })]
          } else if (typeof item[key] === 'object') {
            item[key] = deserializeCase(item[key])
          } else {
            item = deserializeCase(item);
          }
        })
    } else {
      item = deserializeCase(item);
    }
    return this.httpClient
      .post<T>(`${this.baseUrl}`, item)
      .pipe(
        map(item => this.serializer(item))
      );
  }
  update(item: any, id?: number | string): Observable<T> {
    if (typeof item === 'object') {
      Object.keys(item)
        .forEach(key => {
          if (Array.isArray(item[key])) {
            item[key] = [...item[key].map(obj => {
              return deserializeCase(obj)
            })]
          } else if (typeof item[key] === 'object') {
            item[key] = deserializeCase(item[key])
          } else {
            item = deserializeCase(item);
          }
        })
    } else {
      item = deserializeCase(item);
    }
    const url = id ? `${this.baseUrl}/${id}` : `${this.baseUrl}`
    return this.httpClient
      .put<T>(`${url}`, item)
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
  getList(paramsObject: any = {}): Observable<T> {
    return this.httpClient
      .get(`${this.baseUrl}`)
      .pipe(
        map((list: any) => {
          return list.results ? list.results.map(serializeCase) : list.map(serializeCase)
        }),
        map(item => {
          return this.serializer(item)
        })
      );
  }
  deleteById(id: number) {
    return this.httpClient
      .delete(`${this.baseUrl}/${id}`);
  }
};
