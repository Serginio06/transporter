import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {File} from 'ionic-native';
import {Platform} from 'ionic-angular'
import {Global} from '../providers/global'
import {ServerService} from '../providers/server-service';
import {timeout} from "rxjs/operator/timeout";

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

  // public appPropertyDirectory: string = "file:///storage/emulated/0/";
  public appPropertyFile = "TransporterProp.txt";
  // public appCSVDirectory: string = "file:///storage/emulated/0/";
  // public appCSVFile = "";
  // public appLogDirectory: string = "file:///storage/emulated/0/";
  // public appLogFile = "log.csv";
  // public logTitle = "IMEI,timestamp,SessionID,Time,State" + "\n";


  // ==============
  // public returnCheckFile: any;
  public clOnScreen5: any = "";


  constructor(public platform: Platform, public global: Global, private serverService: ServerService) {
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
    this.global.propertyObj.ServerWifiName = this.global.ServerWifiName;
    // this.clOnScreen5 = "Saving to file.SessionID= " + this.global.propertyObj.sessionId;
    // JSON.stringify( this.global.propertyObj);

    // this.returnCheckFile = "fileName:" + fileName;

    this.platform.ready().then(
      () => {
        File.writeFile(
          this.global.appFilesDirectory,
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
          this.global.appFilesDirectory,
          this.appPropertyFile
        ).then(
          (filedata) => {

            this.global.propertyObj = JSON.parse(filedata.toString());

            return this.global.propertyObj;


          }
        );
      }
    );

  }


  saveCSVFile(): any {

    var currentTime = this.global.transformTimeStamp(0, 2);
    var fileContent: string;

    // this.appCSVFile = "data_ID_" + this.global.sessionID + "_" + currentTime + ".csv";


    this.prepareCSVContent().then(
      (fileContent) => {

        // this.clOnScreen5 = "prepareCSVconent: " + fileContent;

        return this.platform.ready().then(
          () => {
            return File.writeFile(
              this.global.appFilesDirectory,
              this.global.appCSVFile,
              fileContent,
              {replace: true}
            )
              .then(
                (result) => {

                  return this.serverService.sendDataToServer(fileContent, "data");
                }
              );


          }
          // );

        );

      }
    );
    // fileContent= this.prepareCSVContent();


    // fileContent = dataContent;


  }

  prepareCSVContent(): any {


    // var csvTitle: string = "IMEI, sendTimestamp, SessionID,gyroTimestamp,gyroX(rad/s),gyroY(rad/s),gyroZ(rad/s), accelTimestamp,accelX,accelY,accelZ, geoTimestamp, Lat,Long,Speed(mph),TrueHeading,Alt(feet),Accuracy,AltAccuracy" + "\n";
    return this.getDataFromFile().then(
      (fileData)=> {

        var csvTitle: string = fileData;


        var timeInMs = Date.now();
        var gyroscopeContent: string = csvTitle + this.global.phoneUUID + "," + timeInMs + "," + this.global.sessionID + ",";
        var accelerometreContent: string = "";
        var geoLocationContent: string = "";
        var counterGeoLocationData: number = 0;
        var counter: number = 1;
        var currentAccelTimestamp: any;


        this.global.accelerometerSessionData.forEach(
          (item, index) => {


            if (index % 4 == 0) {
              currentAccelTimestamp = this.global.accelerometerSessionData[index];
              // this.global.clOnScreen = "curAccTime" + currentAccelTimestamp;
            }


            if (index % 4 == 0 && index != 0) {
              // if ( this.global.gyroscopeSessionData.length ) {
              //   accelerometreContent = "," + accelerometreContent;
              // }

              gyroscopeContent = gyroscopeContent + accelerometreContent.slice(0, -1) + geoLocationContent + "\n" + this.global.phoneUUID + "," + timeInMs + "," + this.global.sessionID + ",";

              // accelerometreContent = accelerometreContent + gyroscopeContent.slice(0, -1) + geoLocationContent + "\n" + this.global.phoneUUID + "," + timeInMs + "," + this.global.sessionID + ",";

              accelerometreContent = "";
            }


            accelerometreContent = accelerometreContent + this.global.accelerometerSessionData[index] + ",";


            if (this.global.gyroscopeSessionData.length) {
              gyroscopeContent = gyroscopeContent + this.global.gyroscopeSessionData[index] + ",";
              // accelerometreContent = accelerometreContent + this.global.accelerometerSessionData[index] + ",";
            } else {
              gyroscopeContent = gyroscopeContent + "noData,";
              // accelerometreContent = accelerometreContent + "null,";
            }

            // this.clOnScreen5 = "noGPS= " + this.global.geoLocationSessionData[counterGeoLocationData]

            if (this.global.geoLocationSessionData.length) {


              if (currentAccelTimestamp >= this.global.geoLocationSessionData[counterGeoLocationData]) {
                geoLocationContent = ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 1]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 2]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 3]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 4]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 5]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 6]) + ",";
                geoLocationContent = geoLocationContent + this.global.changeEmptyValueOnNull(this.global.geoLocationSessionData[counterGeoLocationData + 7]);
                counterGeoLocationData = counterGeoLocationData + 8;
              } else {
                // this.clOnScreen5 = "no GPS data so far";
                // geoLocationContent = ",";
                // geoLocationContent = geoLocationContent + "noData,noData,noData,noData,noData,noData,noData,noData";
                // geoLocationContent = geoLocationContent + "null,null,null,null,null,null,null,null";
              }
            } else {
              //if No GPS data from phone for any reason
              // this.clOnScreen5 = "GPS turned OFF";
              geoLocationContent = ",";
              geoLocationContent = geoLocationContent + "noData,noData,noData,noData,noData,noData,noData,noData";

            }
          }
        );

        gyroscopeContent = gyroscopeContent + accelerometreContent.slice(0, -1) + geoLocationContent + "\n";

        // this.clOnScreen5 = "gyroscopeContent: " + gyroscopeContent;
        return gyroscopeContent;


      }
    );

    // var csvTitle: string = this.getDataFromFile();


  }


  saveLog(): any {

    // var fileContent: string = "";

    return this.prepareLogContent().then(
      (preparedLogContent) => {

        if (preparedLogContent.indexOf("Error") == -1) {

          return this.platform.ready().then(
            () => {


              return File.writeFile(
                this.global.appFilesDirectory,
                this.global.appLogFile,
                preparedLogContent,
                {replace: true}
              ).then(
                (Result) => {

                  this.serverService.sendDataToServer(preparedLogContent, "log");

                  // this.clOnScreen5 = JSON.stringify(result);
                  // this.saveErrorLog(JSON.stringify(result));

                  // if (result) {
                  //   return this.cleanLogFile();
                  // } else {
                  //   return "Error in file log";
                  // }

                  // return

                }
              );
            }
          );
        }


      }
    );


  }

  prepareLogContent(): any {

    // var logTitle: string = "UUID,timestamp,SessionID,Time,State";
    var logContent: string = "";
    var currentTime = this.global.transformTimeStamp(0, 1);
    var timeInMs = Date.now();


    return this.getLogData().then(
      (logFileContent) => {
        logContent = logFileContent + this.global.phoneUUID + "," + timeInMs + "," + this.global.sessionID + ", " + currentTime + ", " + this.global.stateStatus + "\n";

        // this.clOnScreen5 = logContent;


        return logContent;

      }, () => {
        // this.clOnScreen5 = "Error: no data to log";

        return "Error: no data to log";
      }
    )

  }

  getLogData(): any {

    // this.clOnScreen5 = "trying to save log";
    return this.platform.ready().then(
      () => {
        return File.readAsText(
          this.global.appFilesDirectory,
          this.global.appLogFile
        ).then(
          (filedata) => {
            // this.clOnScreen5 = filedata;
            return filedata;

          }, (err)=> {
            // return "IMEI,timestamp,SessionID,Time,State" + "\n";
            return this.global.logTitle;
            // return "Error:" + err;
          }
        );
      }
    );


    // return "";
  }

  getDataFromFile(): any {

    // this.clOnScreen5 = "trying to save log";
    return this.platform.ready().then(
      () => {
        return File.readAsText(
          this.global.appFilesDirectory,
          this.global.appCSVFile
        ).then(
          (filedata) => {
            // this.clOnScreen5 = filedata;
            return filedata;

          }, (err)=> {
            // return "IMEI,timestamp,SessionID,Time,State" + "\n";
            return this.global.dataTitle;
            // return "Error:" + err;
          }
        );
      }
    );


    // return "";
  }




}
