import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = (Math.floor(value / 60));
    let displayMinValue = minutes.toString().length > 1 ? minutes.toString() : ('0' + minutes.toString());
    let seconds = (value - minutes * 60).toString();
    let displaySecValue = seconds.toString().length > 1 ? seconds.toString() : ('0' + seconds.toString());
    return displayMinValue + ':' + displaySecValue;
  }
}