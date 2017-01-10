import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
// import {LocalDataSaveService} from '../providers/local-data-save-service';
import {Platform} from 'ionic-angular';
import {Global} from '../providers/global';
import {HTTP} from 'ionic-native';
import 'rxjs/add/operator/map';
import {ConnectivityService} from '../providers/connectivity-service';
import { Device } from 'ionic-native';


/*
 Generated class for the ServerService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */


// let SERVER_URL = 'https://httpbin.org/ip';

@Injectable()
export class ServerService {

  // private PhoneIMEI: string = 'someIMEI';
  private wifiName: string = '';
  public clOnScreen4: any = "";

  // constructor(public http: Http, public platform: Platform) {
  // constructor(public platform: Platform, private global:Global, public http: Http) {
  constructor(public platform: Platform, public global: Global, public connectivityService: ConnectivityService ) {
    console.log('Hello ServerService Provider');
    // this.http = http;
    this.global.phoneIMEI = this.getPhoneIMEI();
  }


  getServerWifiName(): string {

    // this.clOnScreen4 = "we are in getServerWifiName ";


    if (this.wifiName) {

      // here should be code do get WiFi name from Server based on IMEI

      this.wifiName = 'Lillehammer';
    } else {

      //set wifiName by default = 'Lillehammer'
      this.wifiName = 'Lillehammer';
    }

    return this.wifiName;
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
            this.clOnScreen4 = "Err during data sending. See errorLog file";
            // this.global.errContent = "Log sent err:" + JSON.stringify(error.error);
            this.global.saveErrorLog("Log sent err:" + JSON.stringify(error));
            // console.log(error);
            // console.log(error.status);
            // console.log(error.error); // error message as string
            // console.log(error.headers);
            // return error.status;

          });

      }

    } else {
      this.clOnScreen4 = "Phone is offline. Try send data later"
    }
  }

  getPhoneIMEI(): string {

    // here shoudl be code to get phone's IMEI
    // this.clOnScreen4 = "we are in getPhoneIMEI ";

    // console.log('Device UUID is: ' + Device.uuid);
    // this.clOnScreen4 ="UUID= " + Device.uuid;
    return Device.uuid;
  }


}
