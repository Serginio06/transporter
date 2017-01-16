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
  public isWiFiNameCorrect: boolean = false;


  constructor(public platform: Platform, public global: Global) {
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


  // getPhoneWiFiNameAndCheck(wifiNameToCheck: string) {
  getPhoneWiFiNameAndCheck() {

    // this.clOnScreen2 = "getPhoneWiFiNameAndCheck: " + wifiNameToCheck;

    // this.clOnScreen2 = "before check for ServerWifiName availability ";
    if (this.global.ServerWifiName) {
      // this.clOnScreen2 = "Start scan for wifi SSID";

        this.platform.ready().then(
        () => {

          if (typeof WifiWizard !== 'undefined') {

            // var wifiName = WifiWizard.getCurrentSSID((s) => {
            //
            //   this.checkWiFiNames (s, wifiNameToCheck);
            //
            // }, () => {
            //
            //   // this.clOnScreen2 = "some error in getting wifi SSID";
            //   // this.isWiFiNameCorrect = false; // unrem to start wifi check
            //   this.isWiFiNameCorrect = true;
            //
            // });


            var isWifiEnabled = WifiWizard.isWifiEnabled (
              (isWifiEnabledResult) => {
                // this.clOnScreen2 = "isWifiEnabled result: " + isWifiEnabledResult;

                if ( isWifiEnabledResult ) {


                var wifiName = WifiWizard.getScanResults(
                  (scanWiFiResults) => {
                    // this.clOnScreen2 = "Have got scanWiFiResults";
                    this.checkWiFiNames(scanWiFiResults);


                  }, (errWiFiScan) => {
                    // this.clOnScreen2 = "some error in scan of wifi SSID. See errLog";
                    this.global.clOnScreen = this.global.msg5;
                    this.global.saveErrorLog("getPhoneWiFiNameAndCheck()", "isWifiEnabled = False");
                    this.isWiFiNameCorrect = false; // unrem to start wifi check
                  }
                )
                } else {



                }


              },
              (err) => {
                // this.clOnScreen2 = "isWifiEnabled error: " + err;
                this.global.clOnScreen = this.global.msg4;
                this.global.saveErrorLog("getPhoneWiFiNameAndCheck()", "isWifiEnabled error: " + err);
              }
            );




          } else {

            // this.global.clOnScreen = 'WifiWizard not loaded';
            this.global.clOnScreen = this.global.msg4;
            this.global.saveErrorLog("getPhoneWiFiNameAndCheck()", "WifiWizard not loaded");
            // this.isWiFiNameCorrect = false; // unrem to start wifi check
            // this.isWiFiNameCorrect = true;

          }
        }
      );
    } else {
      this.global.clOnScreen = this.global.msg4;
      this.global.saveErrorLog("getPhoneWiFiNameAndCheck()", "global serverWifiName not defined");
    }


    // return true;

  }

  checkWiFiNames(phoneWifi) {


    // var phoenWIFiCut =  phoneWifi.slice(1,-1);
    // this.isWiFiNameCorrect = phoenWIFiCut == serverWiFi; // unrem to start wifi check
    var arrayScannedSSID = [];
    var isWiFiNameCorrectPreviouse:boolean = this.isWiFiNameCorrect;


    for (var n = 0; n < phoneWifi.length; n++) {

      arrayScannedSSID.push (phoneWifi[n].SSID);
      if ( phoneWifi[n].SSID == this.global.ServerWifiName) {
        this.isWiFiNameCorrect = true;
        break;
      }
      this.isWiFiNameCorrect = false;

    }

    // this.global.clOnScreen = "isWiFiNameCorrect=" + this.isWiFiNameCorrect;

    // if ( !this.isWiFiNameCorrect && isWiFiNameCorrectPreviouse == this.isWiFiNameCorrect) {
    //   this.global.saveErrorLog("checkWiFiNames(phoneWifi)", "ServerWiFiName = " + this.global.ServerWifiName + ". Found WiFi list = " + arrayScannedSSID.toString().replace(",",";"));
    // }

    // this.global.saveErrorLog("wifiArray=" + JSON.stringify(phoneWifi));
    // this.isWiFiNameCorrect = true;

  }


}
