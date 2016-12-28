import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {Platform} from 'ionic-angular'

/*
  Generated class for the ServerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServerService {

  // private PhoneIMEI: string = 'someIMEI';
  private wifiName: string = '';
  public clOnScreen4: any = "";

  // constructor(public http: Http, public platform: Platform) {
  constructor(public platform: Platform) {
    console.log('Hello ServerService Provider');
  }


  getServerWifiName():string {

      // this.clOnScreen4 = "we are in getServerWifiName ";

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
    return "some IMEI"
  }

  sendLogDataToServer (){



  }


}
