import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'OrderByProperty'})
export class OrderByPropertyPipe implements PipeTransform {
 
  transform(array:any[], property:any, desc:boolean) {
    array.sort();
    let sortByProperty = function (property, desc) {
    return function (x, y) {
      if (desc){
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
      }else
      {
        return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
      }
    };
  };
  return array.sort(sortByProperty(property, desc));
}
}