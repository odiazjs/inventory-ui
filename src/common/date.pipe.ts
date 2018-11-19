import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date, args: string[]): any {
    if (!value) return value;
    return new Date(value).toLocaleDateString("en-US")
  }
}