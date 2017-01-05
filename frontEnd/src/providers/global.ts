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
  public stateStatus: string = '';
  public propertyObj: any = {};
  public sessionID: number = 0;
  public gyroscopeSessionData: any = [];
  public accelerometerSessionData:any =[];
  public geoLocationSessionData:any =[];
  public phoneIMEI:string ="";

  constructor() {
    console.log('Hello Global Provider');
    this.propertyObj.sessionId = this.sessionID;
    this.propertyObj.status = this.stateStatus;
  }


  transformTimeStamp(timestamp: number, timeformat: number): string {

    // example of timestamp 30-11-2016 16:21:25.102

    var newDate = timestamp ? new Date(timestamp) : new Date();


    var year = newDate.getFullYear();
    var month = "0" + (newDate.getMonth()+1);
    var day = "0" + newDate.getDate();
    var hours = newDate.getHours();
    var minutes = "0" + newDate.getMinutes();
    var seconds = "0" + newDate.getSeconds();
    var milliseconds = "00" + newDate.getMilliseconds();


    if (timeformat == 1 || timeformat) {
      // time for timestamp in data collection
      var formatedTime = day.substr(-2) + "-" + month.substr(-2) + "-" + year + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds.substr(-3);
    }
      if (timeformat == 2) {
      // time for csv file name
      var formatedTime = year + month.substr(-2) + day.substr(-2) + "_" + hours + minutes.substr(-2) + seconds.substr(-2) + '_' + milliseconds.substr(-3)+"ms";
    }


    return formatedTime;
  }


}
