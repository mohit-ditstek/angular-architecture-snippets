import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyTransform'

})
export class CurrencyTransformPipe implements PipeTransform {
  constructor(private currency: CurrencyPipe) { }

  transform(value: any, args?: any): any {
    let suffixes = ["", "k", "m", "b", "t"];
    if (Number.isNaN(value)) {
      return null;
    }

    if (value < 1000) {
      return value;
    }

    let suffixNum = Math.floor(("" + value).length / 3);
    let shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
      shortValue = Number(shortValue.toFixed(1));
    }

    return shortValue + suffixes[suffixNum];
  }

}