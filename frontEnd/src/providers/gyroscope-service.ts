import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {Global} from '../providers/global'
import {Platform} from 'ionic-angular';

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

  constructor(public global: Global, public platform: Platform) {
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
    var a = this.platform.ready();

    var b = a.then(function () {

      return gyroscope.getCurrent(function (dataSuccess) {
          this.global.clOnScreen = "GyroTime: " + dataSuccess.timestamp;
          return dataSuccess;

        }, function (err) {
          return err;

        })

    }


    );

    // return b.then(function() {
    //   return "a= "+ a + ". b= " + b;
    // });

    //
    //        (gyroscopeData) => {
    //
    //         this.global.clOnScreen = "GyroTime: " + gyroscopeData.timestamp;
    //         // return this.global.clOnScreen;
    //         return gyroscopeData;
    //       })


    // //noinspection TypeScriptUnresolvedVariable
    // return this.platform.ready().then(
    //   () => {
    //     var gyroscope = navigator.gyroscope;
    //     // return "platform is ready";
    //     //
    //      return gyroscope.getCurrent(
    //
    //        (gyroscopeData) => {
    //
    //         this.global.clOnScreen = "GyroTime: " + gyroscopeData.timestamp;
    //         // return this.global.clOnScreen;
    //         return gyroscopeData;
    //       },
    //       (errGyroscope) => {
    //         // return errGyroscope;
    //       }
    //     )
    //   });

  }


}
