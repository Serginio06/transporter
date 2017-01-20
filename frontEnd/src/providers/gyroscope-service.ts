import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {Global} from '../providers/global'
import {Platform, AlertController} from 'ionic-angular';
import {timeout} from "rxjs/operator/timeout";

/*
 Generated class for the GyroscopeService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

declare var navigator: any;


@Injectable()
export class GyroscopeService {

  public gyroscopeX: number = 0;
  public gyroscopeY: number = 0;
  public gyroscopeZ: number = 0;
  public gyroscopeTimeStamp: any = 0;
  private gyroscopeID: any;
  // public gyroscopeSessionData = [];

  constructor(public global: Global, public platform: Platform, private alertController: AlertController) {
    console.log('Hello GyroscopeService Provider');
  }


  startWatchGyroscope() {

    var gyroscope = navigator.gyroscope;
    var options = {frequency: 200};  // Update every 200 miliseconds
    // var intArray = [];

    this.gyroscopeID = gyroscope.watch(
      (acceleration) => {
        var self = this;


        this.gyroscopeX = acceleration.x;
        this.gyroscopeY = acceleration.y;
        this.gyroscopeZ = acceleration.z;
        this.gyroscopeTimeStamp = this.global.transformTimeStamp(acceleration.timestamp, 1);

        this.getGyroscopeDataSession(acceleration.x, acceleration.y, acceleration.z, this.gyroscopeTimeStamp);

      }, () => {

      }, options);

  }

  stopWatchGyroscope() {

    var gyroscope = navigator.gyroscope;

    gyroscope.clearWatch(this.gyroscopeID);
    this.gyroscopeX = 0;
    this.gyroscopeY = 0;
    this.gyroscopeZ = 0;
    this.gyroscopeTimeStamp = 0;

    // return this.gyroscopeSessionData;
  }

  private getGyroscopeDataSession(x: number, y: number, z: number, timestamp: any) {

    this.global.gyroscopeSessionData.push(timestamp);
    this.global.gyroscopeSessionData.push(x.toFixed(5));
    this.global.gyroscopeSessionData.push(y.toFixed(5));
    this.global.gyroscopeSessionData.push(z.toFixed(5));


  }

  public checkGyroscopeAvailability(): any {
    var gyroscope = navigator.gyroscope;


    // var a = this.platform.ready();
    //
    // var b = a.then(function () {
    //
    //   return gyroscope.getCurrent(function (dataSuccess) {
    //       this.global.clOnScreen = "GyroTime: " + dataSuccess.timestamp;
    //       return dataSuccess;
    //
    //     }, function (err) {
    //       return err;
    //
    //     })
    //
    // }
    //
    //
    // );


    //noinspection TypeScriptUnresolvedVariable

    // var isGyroscopeAvailable:boolean = false;

    this.platform.ready().then(
      () => {


        var gyroscope = navigator.gyroscope;
        // return "platform is ready";
        //
        gyroscope.getCurrent(
          (gyroscopeData) => {

            this.global.isGyroscopeAvailable = !!gyroscopeData.timestamp;

          },
          (errGyroscope) => {

            // this.global.clOnScreen = "Gyro check err: ";
            this.global.isGyroscopeAvailable = false;
            this.global.saveErrorLog("checkGyroscopeAvailability()", "Gyro check err: " + JSON.stringify(errGyroscope));
          }
        )

      });

    //------ with bind(this) ---------
    // setTimeout(this.isGyroAlert.bind(this), 1000);
    // setTimeout(this.isGyroAlert.call(this, ["adfdf"]), 5000);

    //------ with function inside setTimeout ---------
    // setTimeout(function () {
    //     //
    //     if (this.global.isGyroscopeAvailable) {
    //       this.presentAlert("Gyroscope info", "Gyroscope found", "OK");
    //     } else {
    //       this.presentAlert("Gyroscope info", "Gyroscope not found", "OK");
    //     }
    //   }.bind(this)
    //
    //   , 2000);

    // ------ with arrow function ------function---
    //   setTimeout(
    //     () => {
    //       if (this.global.isGyroscopeAvailable) {
    //         this.presentAlert("Gyroscope info", "Gyroscope found", "OK");
    //       } else {
    //         this.presentAlert("Gyroscope info", "Gyroscope not found", "OK");
    //       }
    //
    //     }, 1000);

  }

  // public isGyroAlert():boolean {
  //   if (this.global.isGyroscopeAvailable) {
  //     this.presentAlert("Gyroscope info", "Gyroscope found", "OK");
  //     return true;
  //   } else {
  //     this.presentAlert("Gyroscope info", "Gyroscope not found", "OK");
  //     return false;
  //   }
  //
  // }




}
