import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
import {Platform} from 'ionic-angular';
// import 'rxjs/add/operator/map';

import {Network} from 'ionic-native';
import {Global} from '../providers/global'

/*
 Generated class for the ConnectivityService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

declare let Connection: any;
declare let WifiWizard: any;
// declare var clOnScreen:any = "";
// declare var clOnScreen2:any = "";

@Injectable()
export class ConnectivityService {

  onDevice: boolean;
  // public clOnScreen:any = "";
  public clOnScreen2: any = "";
  public isWiFiNameCorrect:boolean = false;



  constructor(public platform: Platform, public global:Global) {
    this.onDevice = this.platform.is('cordova');


  }

  public wifiSSID: any = "initial";

  //============ watch network for a connection

  isOnline(): boolean {
    // console.log("we are in isOnLine provider function");
    if (this.onDevice && Network.connection) {
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }


  getPhoneWiFiNameAndCheck(wifiNameToCheck: string) {

    // this.clOnScreen2 = "getPhoneWiFiNameAndCheck: " + wifiNameToCheck;
    this.platform.ready().then(
      () => {

        if (typeof WifiWizard !== 'undefined') {

          var wifiName = WifiWizard.getCurrentSSID((s) => {

            this.checkWiFiNames (s, wifiNameToCheck);

          }, () => {

            // this.clOnScreen2 = "some error in getting wifi SSID";
            this.isWiFiNameCorrect = false;

          });

        } else {

          // this.clOnScreen2 = 'WifiWizard not loaded';
          this.isWiFiNameCorrect = false;

        }
      }
    );


    // return true;

  }

  checkWiFiNames (phoneWifi, serverWiFi) {

    var check:boolean;
    // this.clOnScreen2 = "Check wifi: " + phoneWifi + " : " + serverWiFi;
    var phoenWIFiCut =  phoneWifi.slice(1,-1);
    this.isWiFiNameCorrect = phoenWIFiCut == serverWiFi;

  }


}
