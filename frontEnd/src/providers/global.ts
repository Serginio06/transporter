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
  public accelerometerSessionData: any = [];
  public geoLocationSessionData: any = [];
  public phoneUUID: string = "";
  public errContent: string = "";
  public appFilesDirectory: string = "file:///storage/emulated/0/";
  public appLogFile = "log.csv";
  public errorLogFile = "errorLog.csv";
  public appCSVFile = "data" + ".csv";
  public logTitle = "UUID,timestamp,SessionID,Time,State" + "\n";
  public dataTitle = "UUID, sendTimestamp, SessionID,gyroTimestamp,gyroX(rad/s),gyroY(rad/s),gyroZ(rad/s), accelTimestamp,accelX,accelY,accelZ, geoTimestamp, Lat,Long,Speed(mph),TrueHeading,Alt(feet),Accuracy,AltAccuracy" + "\n";
  public errorLogFileTitle = "UUID,timestamp, errLocation, errMesage" + "\n";
  public errLogContent:string;
  public ServerWifiName: string = "";
  public clOnScreen: any = "";

  // ========= System messages =========
  public msg1 = "Your phone identificator is not registred. Please contact application administrator";
  public msg2 = "Cannot get your WiFi name. Check that you have internet connection and your phone registered. Try again later or contact application administrator";
  public msg3 = "Err during data sending. See errorLog file";
  public msg4 = "Technical error. Please contact application administrator (log file included)";
  public msg5 = "Please turn on your Wi-Fi";

  constructor(public platform: Platform) {
    console.log('Hello Global Provider');
    this.propertyObj.sessionId = this.sessionID;
    this.propertyObj.status = this.stateStatus;
  }


  transformTimeStamp(timestamp: number, timeformat: number): string {

    // example of timestamp 30-11-2016 16:21:25.102

    var newDate = timestamp ? new Date(timestamp) : new Date();


    var year = newDate.getFullYear();
    var month = "0" + (newDate.getMonth() + 1);
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
      var formatedTime = year + month.substr(-2) + day.substr(-2) + "_" + hours + minutes.substr(-2) + seconds.substr(-2) + '_' + milliseconds.substr(-3) + "ms";
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

  saveErrorLog(errLocation: string, errMsg: string ): any {
    this.errLogContent = "";
    errMsg = errMsg.replace(",",";");

    this.getErrLogFromFile().then(
      (errFileContent) => {

        this.errLogContent = errFileContent + this.phoneUUID + "," + this.transformTimeStamp(0, 2) + "," + errLocation + "," + errMsg + "\n";
        return this.platform.ready().then(
          () => {

            return File.writeFile(
              this.appFilesDirectory,
              this.errorLogFile,
              this.errLogContent,
              {replace: true}
            );
          }
        );


      }
    );

    // var currentTime = this.transformTimeStamp(0, 2);
    // // var fileContent: string;
    //
    // // this.appCSVFile = "data_ID_" + this.global.sessionID + "_" + currentTime + ".csv";
    //
    // // var errFormated = this.phoneUUID + "," + this.transformTimeStamp(0, 2) + "," + errLocation + "," + errMsg + "\n";
    //
    // // var errorFile = "errorLog_" + currentTime + ".csv";
    // // var errorFile = "errorLog.csv";




  }

  getErrLogFromFile(): any {

    // this.clOnScreen5 = "trying to save log";
    return this.platform.ready().then(
      () => {
        return File.readAsText(
          this.appFilesDirectory,
          this.errorLogFile
        ).then(
          (filedata) => {
            // this.clOnScreen5 = filedata;
            return filedata;

          }, (err)=> {
            // return "IMEI,timestamp,SessionID,Time,State" + "\n";
            return this.errorLogFileTitle;
            // return "Error:" + err;
          }
        );
      }
    );


    // return "";
  }

  globalCleanErrorFile(): any {

    // let logTitle =

    return this.platform.ready().then(
      () => {

        return File.writeFile(
          this.appFilesDirectory,
          this.errorLogFile,
          this.errorLogFileTitle,
          {replace: true}
        );
      }
    );

  }

  changeEmptyValueOnNull(value:any):string {
    if ( value === 0 || value === null || value === '' || value === undefined  ) {
        return "null";
    } else {
      return value;
    }


  }


}
