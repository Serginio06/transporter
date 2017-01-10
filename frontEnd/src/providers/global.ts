import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {File} from 'ionic-native';
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
  public errContent:string = "";
  public appFilesDirectory: string = "file:///storage/emulated/0/";
  public appLogFile = "log.csv";
  public appCSVFile = "data" + ".csv";
  public logTitle = "IMEI,timestamp,SessionID,Time,State" + "\n";
  public dataTitle = "IMEI, sendTimestamp, SessionID,gyroTimestamp,gyroX(rad/s),gyroY(rad/s),gyroZ(rad/s), accelTimestamp,accelX,accelY,accelZ, geoTimestamp, Lat,Long,Speed(mph),TrueHeading,Alt(feet),Accuracy,AltAccuracy" + "\n";

  constructor(public platform: Platform) {
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

  globalCleanLogFile(): any {

    // let logTitle =

    return this.platform.ready().then(
      () => {

        return File.writeFile(
          this.appFilesDirectory,
          this.appLogFile,
          this.logTitle,
          {replace: true}
        );
      }
    );

  }

  globalCleanDataFile(): any {

    // let logTitle =

    return this.platform.ready().then(
      () => {

        return File.writeFile(
          this.appFilesDirectory,
          this.appCSVFile,
          this.dataTitle,
          {replace: true}
        );
      }
    );

  }

  saveErrorLog(err: string): any {

    var currentTime = this.transformTimeStamp(0, 2);
    // var fileContent: string;

    // this.appCSVFile = "data_ID_" + this.global.sessionID + "_" + currentTime + ".csv";
    var errorFile = "errorLog_" + currentTime + ".txt";

    return this.platform.ready().then(
      () => {

        return File.writeFile(
          this.appFilesDirectory,
          errorFile,
          err,
          {replace: true}
        );
      }
    );


  }


}
