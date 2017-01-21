import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
// import {LocalDataSaveService} from '../providers/local-data-save-service';
import {Platform} from 'ionic-angular';
import {Global} from '../providers/global';
import {HTTP} from 'ionic-native';
import 'rxjs/add/operator/map';
import {ConnectivityService} from '../providers/connectivity-service';
import {Device} from 'ionic-native';
import {tryCatch} from "rxjs/util/tryCatch";
// import 'rxjs/add/operator/catch';


/*
 Generated class for the ServerService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */


// let SERVER_URL = 'https://httpbin.org/ip';

@Injectable()
export class ServerService {

  // private PhoneIMEI: string = 'someIMEI';
  // private wifiName: string = '';
  public clOnScreen4: any = "";

  // constructor(public http: Http, public platform: Platform) {
  // constructor(public platform: Platform, private global:Global, public http: Http) {
  constructor(public platform: Platform, public global: Global, public connectivityService: ConnectivityService) {
    console.log('Hello ServerService Provider');
    // this.http = http;
    this.global.phoneUUID = this.getPhoneUUID();
  }


  getServerWifiName(): any {

    try {
      if (this.connectivityService.isOnline()) {

        if (!this.global.ServerWifiName) {

          var req: any;
          var url: string = 'https://cherry2016.herokuapp.com/users/' + this.global.phoneUUID;
          let headers = JSON.parse('{"Content-Type": "application/json"}');

          return HTTP.get(url, {}, headers)
            .then(data => {

              if (data.data != "") {
                let cleanedData = JSON.stringify(data.data).replace(/\\/g, "");
                cleanedData = cleanedData.replace(/\n/g, "");
                cleanedData = cleanedData.slice(0, -1);
                cleanedData = cleanedData.slice(1);

                let dataDataObj: any = JSON.parse(cleanedData);

                this.global.ServerWifiName = dataDataObj.WifiName;

                return this.global.ServerWifiName;
              } else {
                // this.global.clOnScreen = "getServerWifiName()=" + this.global.msg1;
                return "";
              }

            })
            .catch(error => {
              this.global.clOnScreen = this.global.msg4;
              this.global.saveErrorLog("getServerWifiName()", "Err during data sending: " + JSON.stringify(error));
            });

          // this.wifiName = 'Lillehammer';
        } else {
          return this.global.ServerWifiName;
        }


      } else {
        // this.clOnScreen4 = "Phone is offline. Check your internet connection";
        this.global.saveErrorLog("getServerWifiName()", "Phone is offline. Try send data later");
      }
    }
    catch (err) {
      // this.global.clOnScreen9 = "Err in geting wifiname";
      this.global.saveErrorLog("getServerWifiName()", "try-catch err: " + err);
    }
  }


  sendDataToServer(dataToSend: string, dataType: string) {
    try {

      if (this.connectivityService.isOnline()) {


        let headers = JSON.parse('{"Content-Type": "application/json"}');

        if (dataType != "data" && dataType != "log") {
          // this.clOnScreen4 = "Error: dataType is wrong" + dataType;
          // this.global.errContent = "Error: dataType is wrong" + dataType;
          this.global.saveErrorLog("sendDataToServer()", "Error: dataType is wrong" + dataType)
        } else {

          let SERVER_URL = 'https://cherry2016.herokuapp.com/data/' + dataType;

          let body = this.transformCSVInJson(dataToSend);

          HTTP.post(SERVER_URL, body, headers)
            .then(data => {

              if (dataType == "log") {
                this.global.globalCleanLogFile();
              } else if (dataType == "data") {
                this.global.globalCleanDataFile();
              }

              // console.log(data.status);
              // console.log(data.data); // data received by server
              // console.log(data.headers);
            })
            .catch(error => {

              // this.localDataSaveService.saveErrorLog(JSON.stringify(error));
              // this.global.clOnScreen = this.global.msg3;
              this.global.saveErrorLog("sendDataToServer()", "Err during data sending: " + JSON.stringify(error));
              // console.log(error);
              // console.log(error.status);
              // console.log(error.error); // error message as string
              // console.log(error.headers);
              // return error.status;

            });

          // this.sendErrLogToServer(this.global.errLogContent);


        }

      } else {
        // this.clOnScreen4 = "Phone is offline. Try send data later";
        // this.global.saveErrorLog("sendDataToServer()", "Phone is offline. Try send data later");
      }

    }
    catch (err) {

      // this.global.clOnScreen9 = "err in send data/log to server";
      this.global.saveErrorLog("sendDataToServer()", "try-catch err: " + err);
    }
  }

  sendErrLogToServer(errDataToSend) {

    // this.global.clOnScreen = "errDTS= " + errDataToSend;
    // this.global.saveErrorLog("sendErrLogToServer","errDTS= " + errDataToSend );
    if (this.connectivityService.isOnline()) {
      if (errDataToSend === undefined) {

        // this.global.clOnScreen = "errDataToSend === undefined";


      } else {

        // this.global.clOnScreen = "errDataToSend !== undefined: " + errDataToSend;

        let headers = JSON.parse('{"Content-Type": "application/json"}');

        // ========= Send error Log to server and clean local file
        let errSERVER_URL = 'https://cherry2016.herokuapp.com/data/err';

        var parseResult: boolean = true;

        try {
          var body = this.transformCSVInJson(errDataToSend);
        }
        catch (err) {
          parseResult = false;
          errDataToSend = "";
          // var body = this.transformCSVInJson();


          this.global.saveErrorLog("sendErrorDataToServer()", "parse body of errLog - catch_err: " + JSON.stringify(err.message) + "errDataToSend: " + errDataToSend);

        }

        // this.global.clOnScreen = "body= " + body;

        if (parseResult) {
          HTTP.post(errSERVER_URL, body, headers)
            .then(data => {

              this.global.globalCleanErrorFile();

            })
            .catch(error => {

              this.global.saveErrorLog("sendErrorDataToServer()", "Err during data sending: " + JSON.stringify(error.error));

            });
        }


      }
    } else {


    }
  }


  transformCSVInJson(data: string): any {
    let Json: any = data;

    Json = Json.replace(/\n/g, "\\n");
    Json = Json.replace(/"/g, "|");
    Json = Json.replace(/'/g, "|");
    Json = Json.slice(0, -2);

    Json = JSON.parse('{"data":"' + Json + '"}');
    return Json;

  }

  getPhoneUUID(): string {

    return Device.uuid;
  }


}
