import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {Platform} from 'ionic-angular'
import {Global} from '../providers/global'
import {HTTP} from 'ionic-native'
import 'rxjs/add/operator/map';

/*
  Generated class for the ServerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

let SERVER_URL = 'https://cherry2016.herokuapp.com/data/log';
// let SERVER_URL = 'https://httpbin.org/ip';

@Injectable()
export class ServerService {

  // private PhoneIMEI: string = 'someIMEI';
  private wifiName: string = '';
  public clOnScreen4: any = "";

  // constructor(public http: Http, public platform: Platform) {
  // constructor(public platform: Platform, private global:Global, public http: Http) {
  constructor(public platform: Platform, private global:Global) {
    console.log('Hello ServerService Provider');
    this.http = http;

  }


  getServerWifiName():string {

      // this.clOnScreen4 = "we are in getServerWifiName ";
    this.global.phoneIMEI = this.getPhoneIMEI();

    if ( this.wifiName ) {

      // here should be code do get WiFi name from Server based on IMEI

      this.wifiName = 'Lillehammer';
    } else {

      //set wifiName by default = 'Lillehammer'
      this.wifiName = 'Lillehammer';
    }

    return this.wifiName;
  }

  getPhoneIMEI (): string {

    // here shoudl be code to get phone's IMEI
    // this.clOnScreen4 = "we are in getPhoneIMEI ";
    return "IMEI1111"
  }




  sendLogDataToServer (){


    // this.http.get(SERVER_URL).map(res => res.json()).subscribe(data => {
    //   this.clOnScreen4 = "status" + JSON.stringify (data);
    // console.log("status" + JSON.stringify (data));
    //
    //
    // });

// this.http.get(SERVER_URL)
//   .map(res => {
//
//     this.clOnScreen4 = "status" + res;
//     console.log("status" + res);
//
//
//   });


    // let headers = JSON.parse('{"Content-Type": "text/plain"}');
    let headers = JSON.parse('{"Content-Type": "application/json"}');
    // let options = new RequestOptions({
    //   headers: headers
    // });

    // let str1 = '{"data": "SessionID,Time,State';
    // let str2 = '\\n';
    // let str3 = '5, 29-12-2016 14:56:01.997, Record"}';
    // let string = str1.concat(str2,str3);

    let body = JSON.parse('{"data": "SessionID,Time,State\\n 5, 29-12-2016 14:56:01.997, Record",' +
      '"imei":"' + this.global.phoneIMEI + '"}');

    console.log("header: " + headers );
    console.log("body: " + body );

    // HTTP.get('https://cherry2016.herokuapp.com/', {}, {})
    HTTP.post(SERVER_URL,body,headers)
      .then(data => {

        this.clOnScreen4 = "s: " + JSON.stringify(data);
        // console.log(data.status);
        // console.log(data.data); // data received by server
        // console.log(data.headers);

      })
      .catch(error => {

        this.clOnScreen4 = "st " + JSON.stringify(error);
        console.log(error);
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);

      });




  }


}
