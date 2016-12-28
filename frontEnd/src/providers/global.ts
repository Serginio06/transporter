import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
// import
// import {HomePage} from "../pages/home/home"; (HomePage)

/*
 Generated class for the Global provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Global {

  // public gyrodata = [];
  public stateStatus:string = '';
  public propertyObj:any = {};
  public sessionID: number = 0;




  constructor() {
    console.log('Hello Global Provider');
    this.propertyObj.sessionId = this.sessionID;
    this.propertyObj.status = this.stateStatus;
  }


  transformTimeStamp(timestamp: number): string {

    var newDate = new Date(timestamp);
    var hours = newDate.getHours();
    var minutes = "0" + newDate.getMinutes();
    var seconds = "0" + newDate.getSeconds();
    var milliseconds = "00" + newDate.getMilliseconds();

    // Will display time in 10:30:23.123 format
    var formatedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds.substr(-3);

    return formatedTime;
  }





}
