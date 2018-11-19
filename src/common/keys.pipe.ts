import { Pipe, PipeTransform } from '@angular/core';

@Pipe( { name: 'keys' } )
export class KeysPipe implements PipeTransform {
    static pipe ( value, args?: string[] ): any {
        const keys = [];
        for ( const key in value ) {
            keys.push( { key, value: value[ key ] } );
        }
        return keys;
    }
    transform ( value, args: string[] ): any {
        const keys = [];
        for ( const key in value ) {
            keys.push( { key, value: value[ key ] } );
        }
        return keys;
    }
}
