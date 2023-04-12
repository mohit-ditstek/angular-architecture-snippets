import { of, throwError } from 'rxjs';
import { DateUtils } from './DateUtils';
import { StorageKeys } from './storage-keys';

export class Utils {
  constructor() {
  }

  static handleError(response: any) {
    const error = response.error
    const messages = response.error?.message?.map && response.error?.message?.map(err => err?.error);
    return throwError(messages || error);
  }

  static objectToQueryString(obj: any): string {
    let str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  }

  /*Return array obect key value to string array*/
  static arrayObjToString(object, key) {
    if (typeof object === 'object') {
      return object.map(function (obj) {
        return obj[key];
      });
    } else {
      return JSON.parse(object).map(function (obj) {
        return obj[key];
      });
    }
  }

  /*Return array obect key value to string array*/
  static stringToArrayObj(object, key) {
    if (typeof object === 'object') {
      return object.map(function (obj) {
        return { [key]: obj };
      });
    }
  }

  /*Return object key value to number type*/
  static strNum(object, key) {
    return JSON.parse(object).map(function (obj) {
      return parseInt(obj[key]);
    });
  }

  /*Parse json object*/
  static parse(str) {
    if (str && typeof str === 'string') {
      try {
        return JSON.parse(str);
      } catch (e) {
        return 0;
      }
    } else {
      return str;
    }
  }

  /*Convert bytes size in kb, mb, gb etc format */
  static calculateBytes(sizeInBytes, longForm?: boolean) {
    if (sizeInBytes === 0) return '0 Bytes';

    const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const FILE_SIZE_UNITS_LONG = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Pettabytes', 'Exabytes', 'Zettabytes', 'Yottabytes'];

    let units: any;

    units = longForm ? FILE_SIZE_UNITS_LONG : FILE_SIZE_UNITS;

    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);
    const size = sizeInBytes / Math.pow(1024, power); // size in new units
    const formattedSize = Math.round(size * 100) / 100; // keep up to 2 decimals
    const unit = units[power];
    return `${formattedSize}`;
  }

  /*Convert base64 to bytes */
  static base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  /*Download selected file from client side*/
  static saveFile(name, extension, byte) {
    var blob = new Blob([byte], { type: extension });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  /*Create link from file to open as url */
  static returnLink(name, extension, byte) {
    var blob = new Blob([byte], { type: extension });
    return blob;
  }

  static allowNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) event.preventDefault();
  }

  static getCurrentDateTimeHourly() {
    const currentTime = new Date()
    let currentHour = currentTime.getHours()
    let currentMinute = currentTime.getMinutes()

    if (currentMinute > 30) {
      currentTime.setHours(currentHour + 1)
      currentTime.setMinutes(0)
    } else {
      currentTime.setMinutes(30)
    }

    return currentTime
  }

  static getCurrentTimePlus30Minutes() {
    const currentTime = Utils.getCurrentDateTimeHourly()
    return DateUtils.addMins(currentTime, 30)
  }

  static isBeforeCurrentTime(time) {
    return new Date().getTime() > new Date(time).getTime()
  }


  static emailRegEx = '^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  static cinRegEx = '^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$';
  static allowAlphabatesRegEx = '[a-zA-Z .-]+';
  static llpRegEx = '^([A-Za-z]{3})-([0-9]{4})$'
  // Convert bytes into MB
  static convertBytesToMb(originalfileSize) {
    const kiloByte = 1024;
    let convertIntoMb = originalfileSize / kiloByte / kiloByte;
    return convertIntoMb
  }

// Error Message
  static getErrorMessage(err){
   return err.message || (err.reduce && err?.reduce((c, m) => m + ' ', '')) || err
  }

  // for updating the sidenav
  static updateSideNav(path,lastVisited,title,logoUrl){
    localStorage.setItem(StorageKeys.keys.LASTVISITED, JSON.stringify({ 
      path: path, 
      lastVisited: lastVisited, 
      title: title, 
      logoUrl: logoUrl
    }))
    return true
  }
}


