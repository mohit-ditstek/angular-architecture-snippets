import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listingLabelByValue'
})
export class ListingLabelByValuePipe implements PipeTransform {

  transform(key: any, options: any): any {
    let result = options?.find(x => x.key == key)
    if (result)
      return result.value;
    else
      return "";
  }

}
