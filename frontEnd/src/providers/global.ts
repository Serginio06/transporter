import {Injectable} from '@angular/core';
import {Platform, AlertController, LoadingController} from 'ionic-angular';
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

declare var cordova: any;

@Injectable()
export class Global {

  // ===== configuration variables ========
  // public timeWiFiCheck: number = 30; // interval of time to check if wifi available in sec
  // public timeLogWrite = 120; // interval of time to write log file in sec
  // public buttonText: string = "Drive";
  // public timeErrLogWrite = 30; // interval of time to write errLog file and send it to server in sec
  public stateStatus: string = '';
  public propertyObj: any = {};
  public sessionID: number = 0;
  public gyroscopeSessionData: any = [];
  public accelerometerSessionData: any = [];
  public geoLocationSessionData: any = [];
  public phoneUUID: string = "";
  // public errContent: string = "";
  // public appFilesDirectory: string = "file:///storage/emulated/0/";
  public appFilesDirectory: string = cordova.file.externalDataDirectory;
  public appLogFile = "log.csv";
  public errorLogFile = "errorLog.csv";
  public appCSVFile = "data" + ".csv";
  public logTitle = "UUID,timestamp,SessionID,Time,State" + "\n";
  public dataTitle = "UUID, sendTimestamp, SessionID,gyroTimestamp,gyroX(rad/s),gyroY(rad/s),gyroZ(rad/s), accelTimestamp,accelX,accelY,accelZ, geoTimestamp, Lat,Long,Speed(mph),TrueHeading,Alt(feet),Accuracy,AltAccuracy" + "\n";
  public errorLogFileTitle = "UUID,timestamp, errLocation, errMesage" + "\n";
  public errLogContent: string = "";
  public ServerWifiName: string = "";
  public clOnScreen: any = "";
  public clOnScreen8: any = "";
  public clOnScreen9: any = "";
  public clOnScreen10: any = "";
  public isGyroscopeAvailable: boolean = false;
  // public isAccelerometerAvailable: boolean = false;
  public isGPSAvailable: boolean = false;
  public loaderSpinner: any;
  public isAllSensorAvailable: string = "noCheck";


  // ========= System messages =========
  public msg1 = "Your phone identificator is not registred. Please contact application administrator";
  public msg2 = "Cannot get your WiFi name. Check that you have internet connection and your phone registered. Try again later or contact application administrator";
  public msg3 = "Err during data sending. See errorLog file";
  public msg4 = "Technical error. Please contact application administrator (log file included)";
  public msg5 = "Please turn on your Wi-Fi";
  public generalSpinnerMsg = "Please wait...";
  public spinnerSensorCheckMsg = "Checking sensors availability...";

  constructor(public platform: Platform, public alertController: AlertController, public loadingController: LoadingController) {
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

         this.gyroscopeSessionData = [];
         this.accelerometerSessionData = [];
         this.geoLocationSessionData = [];

        return File.writeFile(
          this.appFilesDirectory,
          this.appCSVFile,
          this.dataTitle,
          {replace: true}
        );
      }
    );

  }

  saveErrorLog(errLocation: string, errMsg: string): any {
    // this.clOnScreen = "saveErrorLog called: " + errLocation;
    this.errLogContent = "";
    errMsg = errMsg.replace(",", ";");
    errMsg = errMsg.replace(",", ";");

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


      }, (err) => {
        this.clOnScreen9 = "err in errLog file write";


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
    // this.clOnScreen = "we are in globalCleanErrorFile()";

    return this.platform.ready().then(
      () => {
        this.errLogContent = "";
        return File.writeFile(
          this.appFilesDirectory,
          this.errorLogFile,
          this.errorLogFileTitle,
          {replace: true}
        );

      }
    );


  }

  changeEmptyValueOnNull(value: any): string {
    if (value === 0 || value === null || value === '' || value === undefined) {
      return "null";
    } else {
      return value;
    }


  }


  public presentAlert(title, subTitle, button: string) {

    let alert = this.alertController.create({
      title: title,
      subTitle: subTitle,
      buttons: [button]
    });
    alert.present();
  }


  presentLoadingSpinner(message: string) {

    let spinMessage: string = message || this.generalSpinnerMsg;

    this.loaderSpinner = this.loadingController.create({
      spinner: 'dots',
      content: spinMessage,
      // duration: 3000
    });
    this.loaderSpinner.present();
  }

  dismissLoadingSpinner() {
    this.loaderSpinner.dismiss();
  }


}
