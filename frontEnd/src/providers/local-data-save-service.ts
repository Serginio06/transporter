import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {File} from 'ionic-native';
import {Platform} from 'ionic-angular'
import {Global} from '../providers/global'

/*
 Generated class for the LocalDataSaveService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare var cordova: any;
// declare var window: any;


@Injectable()
export class LocalDataSaveService {
  // ===== configuratioin

  public appPropertyDirectory: string = "file:///storage/emulated/0/";
  public appPropertyFile = "TransporterProp.txt";
  public appCSVDirectory: string = "file:///storage/emulated/0/";
  public appCSVFile = "";
  public appLogDirectory: string = "file:///storage/emulated/0/";
  public appLogFile = "log.csv";


  // ==============
  // public returnCheckFile: any;
  public clOnScreen5: any = "";


  constructor(public platform: Platform, public global: Global) {
    console.log('Hello LocalDataSaveService Provider');
    // var this.platform = platform;

  }


  public saveAppPropertyToFile(): void {

    // var currentDate = new Date;
    // var fileName = "test" + currentDate.toDateString() + ".txt";


    // let folderpath = cordova.file.externalApplicationStorageDirectory;
    let folderpath = cordova.file.externalDataDirectory;

    // let folderpath = "file:///storage/emulated/0/";

    // var statusObj:any;

    // this.global.propertyObj.status = status;


    this.global.propertyObj.sessionId = this.global.sessionID;
    this.global.propertyObj.status = this.global.stateStatus;
    // this.clOnScreen5 = "Saving to file.SessionID= " + this.global.propertyObj.sessionId;
    // JSON.stringify( this.global.propertyObj);

    // this.returnCheckFile = "fileName:" + fileName;

    this.platform.ready().then(
      () => {
        File.writeFile(
          this.appPropertyDirectory,
          this.appPropertyFile,
          JSON.stringify(this.global.propertyObj),
          {replace: true}
        );
      }
    );

  }

  public getPropertyObjFromFile(): any {


    return this.platform.ready().then(
      () => {
        return File.readAsText(
          this.appPropertyDirectory,
          this.appPropertyFile
        ).then(
          (filedata) => {

            this.global.propertyObj = JSON.parse(filedata.toString());

            return this.global.propertyObj;

            // if ( !this.global.propertyObj.status ) { this.clOnScreen5 = "there is no status property" }
            // if ( !this.global.propertyObj.sessionId ) { this.clOnScreen5 = "there is no sessionId property" }
            //
            // if ( this.global.propertyObj.status && this.global.propertyObj.sessionId ) {
            //   this.clOnScreen5 = "From file: " + this.global.propertyObj.status + ":" + this.global.propertyObj.sessionId ;
            // }


          }
        );
      }
    );

  }


  saveCSVFile(): boolean {

    var currentTime = this.global.transformTimeStamp(0, 2);
    var fileContent: string;

    this.appCSVFile = "data_ID_" + this.global.sessionID + "_" + currentTime + ".csv";

    fileContent = this.prepareCSVContent();
    // this.clOnScreen5 = "File= " + this.appCSVFile;
    // this.clOnScreen5 = "fileContent= " + fileContent;


    this.platform.ready().then(
      () => {
        File.writeFile(
          this.appCSVDirectory,
          this.appCSVFile,
          fileContent,
          {replace: true}
        );
      }
    );


    return true;

  }

  prepareCSVContent(): string {

    // var csvTitle:String = "Timestamp,accelX,accelY,accelZ,gyroX(rad/s),gyroY(rad/s),gyroZ(rad/s),Roll(rads),Pitch(rads),Yaw(rads),Lat,Long,Speed(mph),TrueHeading,Alt(feet),"+"/n";
    var csvTitle: string = "SessionID,gyroTimestamp,gyroX(rad/s),gyroY(rad/s),gyroZ(rad/s), accelTimestamp,accelX,accelY,accelZ, geoTimestamp, Lat,Long,Speed(mph),TrueHeading,Alt(feet),Accuracy,AltAccuracy" + "\n";
    var csvContent: string = csvTitle + this.global.sessionID + ",";
    var accelerometreContent: string = "";
    var geoLocationContent: string = "";
    var counterGeoLocationData: number = 0;
    var counter: number = 1;
    var currentAccelTimestamp: any;


    this.clOnScreen5 = "Geo=" + this.global.geoLocationSessionData.length + ". GyroL=" + this.global.gyroscopeSessionData.length + ". AccelL= " + this.global.accelerometerSessionData.length;


    this.global.gyroscopeSessionData.forEach(
      (item, index) => {


        if (index % 4 == 0) {
          currentAccelTimestamp = this.global.accelerometerSessionData[index];
        }


        if (index % 4 == 0 && index != 0) {
          csvContent = csvContent + accelerometreContent + geoLocationContent + "\n" + this.global.sessionID + ",";
          accelerometreContent = "";
        }

        csvContent = csvContent + item + ",";
        accelerometreContent = accelerometreContent + this.global.accelerometerSessionData[index] + ",";

        if (currentAccelTimestamp >= this.global.geoLocationSessionData[counterGeoLocationData]) {
          geoLocationContent = "";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 1] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 2] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 3] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 4] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 5] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 6] + ",";
          geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData + 7] + ",";

          counterGeoLocationData = counterGeoLocationData + 8;
        } else {


        }


        // geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData * counter] + ",";
        //
        // if (index % 3 == 0 && index != 0) {
        //   geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData * counter + 1];
        //   geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData * counter + 2];
        //   geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData * counter + 3];
        //   geoLocationContent = geoLocationContent + this.global.geoLocationSessionData[counterGeoLocationData * counter + 4];
        // }


      }
    );

    csvContent = csvContent + accelerometreContent + geoLocationContent + "\n";


    return csvContent;

  }


  saveLog() {

    // var fileContent: string = "";

    this.prepareLogContent().then(
      (preparedLogContent) => {

        this.platform.ready().then(
          () => {

            File.writeFile(
              this.appLogDirectory,
              this.appLogFile,
              preparedLogContent,
              {replace: true}
            );
          }
        );
      }
    );


  }

  prepareLogContent(): any {

    var logTitle: string = "SessionID,Time,State";
    var logContent: string = "";
    var currentTime = this.global.transformTimeStamp(0, 1);

    return this.getLogData().then(
      (logFileContent) => {
        logContent = logFileContent + this.global.sessionID + ", " + currentTime + ", " + this.global.stateStatus + "\n";
        return logContent;

      }, () => {
        return "no data to log";
      }
    )

  }

  getLogData(): any {

    return this.platform.ready().then(
      () => {
        return File.readAsText(
          this.appLogDirectory,
          this.appLogFile
        ).then(
          (filedata) => {

            return filedata;

          }, (err)=> {
            return "SessionID,Time,State" +"\n"
          }
        );
      }
    );


    // return "";
  }


}
