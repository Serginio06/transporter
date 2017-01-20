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

    if (this.connectivityService.isOnline()) {

      if (!this.global.ServerWifiName) {

        // this.clOnScreen4 = "IF positive";
        // here should be code do get WiFi name from Server based on UUID. Siv UUID=d93bed755ea75489
        var req: any;
        var url: string = 'https://cherry2016.herokuapp.com/users/' + this.global.phoneUUID;
        let headers = JSON.parse('{"Content-Type": "application/json"}');

        // this.global.saveErrorLog("url= " + url);

        return HTTP.get(url, {}, headers)
          .then(data => {

            // this.global.saveErrorLog("data= " + data);

            if (data.data != "") {
              let cleanedData = JSON.stringify(data.data).replace(/\\/g, "");
              cleanedData = cleanedData.replace(/\n/g, "");
              cleanedData = cleanedData.slice(0, -1);
              cleanedData = cleanedData.slice(1);

              let dataDataObj: any = JSON.parse(cleanedData);
              // this.global.saveErrorLog("data= " + JSON.stringify(data));
              // this.global.saveErrorLog("dataDataObj= " + JSON.stringify(dataDataObj));
              // this.clOnScreen4 = "getWiN= " + dataDataObj.WifiName;


              this.global.ServerWifiName = dataDataObj.WifiName;
              // this.clOnScreen4 = this.global.ServerWifiName;
              return this.global.ServerWifiName;
            } else {
              this.global.clOnScreen = "getServerWifiName()=" + this.global.msg1;
              return "";
            }
            // console.log(data.status);
            // console.log(data.data); // data received by server
            // console.log(data.headers);

          })
          .catch(error => {

            // this.localDataSaveService.saveErrorLog(JSON.stringify(error));
            // this.clOnScreen4 = "Err during data sending. See errorLog file";
            this.global.clOnScreen = this.global.msg4;
            this.global.saveErrorLog("getServerWifiName()", "Err during data sending: " + JSON.stringify(error));
            // console.log(error);
            // console.log(error.status);
            // console.log(error.error); // error message as string
            // console.log(error.headers);
            // return error.status;

          });

        // this.wifiName = 'Lillehammer';
      } else {
        // this.clOnScreen4 = "IF negative";
        return this.global.ServerWifiName;
        //set wifiName by default = 'Lillehammer'
        // this.wifiName = 'Lillehammer';
      }


    } else {
      this.clOnScreen4 = "Phone is offline. Check your internet connection"
      this.global.saveErrorLog("getServerWifiName()", "Phone is offline. Try send data later");
    }


    // this.global.ServerWifiName = "wifi from server";


  }


  sendDataToServer(dataToSend: string, dataType: string) {

    if (this.connectivityService.isOnline()) {


      let headers = JSON.parse('{"Content-Type": "application/json"}');

      if (dataType != "data" && dataType != "log") {
        this.clOnScreen4 = "Error: dataType is wrong" + dataType;
        this.global.errContent = "Error: dataType is wrong" + dataType;
      } else {

        // this.clOnScreen4 = "in else";
        let SERVER_URL = 'https://cherry2016.herokuapp.com/data/' + dataType;
        // let SERVER_URL = 'https://cherry2016.herokuapp.com/data/log';

        dataToSend = dataToSend.replace(/\n/g, "\\n");
        dataToSend = dataToSend.slice(0, -2);
        // this.global.errContent = dataToSend;

        // this.global.saveErrorLog(dataToSend);

        var body = JSON.parse('{"data":"' + dataToSend + '"}');

        // this.clOnScreen4 = "b: " + body;

        // HTTP.get('https://cherry2016.herokuapp.com/', {}, {})

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
            this.global.clOnScreen = this.global.msg3;
            this.global.saveErrorLog("sendDataToServer()", "Err during data sending: " + JSON.stringify(error));
            // console.log(error);
            // console.log(error.status);
            // console.log(error.error); // error message as string
            // console.log(error.headers);
            // return error.status;

          });

        // Send error Log to server and clean local file
        let errSERVER_URL = 'https://cherry2016.herokuapp.com/data/err';
        // let body2 = this.global.errLogContent;


        var errDataToSend = this.global.errLogContent;
        errDataToSend = errDataToSend.replace(/\n/g, "\\n");
        errDataToSend = errDataToSend.slice(0, -2);
        let body2 = JSON.parse('{"data":"' + errDataToSend +'"}');

        HTTP.post(errSERVER_URL, body2, headers)
          .then(data => {

            // if (dataType == "log") {
            //   this.global.globalCleanLogFile();
            // } else if (dataType == "data") {
            //   this.global.globalCleanDataFile();
            // }

            this.global.globalCleanErrorFile();

            // console.log(data.status);
            // console.log(data.data); // data received by server
            // console.log(data.headers);
          })
          .catch(error => {

            // this.localDataSaveService.saveErrorLog(JSON.stringify(error));
            this.global.clOnScreen = this.global.msg3;
            this.global.saveErrorLog("sendErrorDataToServer()", "Err during data sending: " + JSON.stringify(error));
            // console.log(error);
            // console.log(error.status);
            // console.log(error.error); // error message as string
            // console.log(error.headers);
            // return error.status;

          });


      }

    } else {
      // this.clOnScreen4 = "Phone is offline. Try send data later";
      this.global.saveErrorLog("sendDataToServer()", "Phone is offline. Try send data later");
    }
  }

  getPhoneUUID(): string {

    // here shoudl be code to get phone's IMEI
    // this.clOnScreen4 = "we are in getPhoneUUID ";

    // console.log('Device UUID is: ' + Device.uuid);
    // this.clOnScreen4 ="UUID= " + Device.uuid;
    return Device.uuid;
  }


}
