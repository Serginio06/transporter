import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {Global} from '../providers/global'

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

  constructor(public global: Global) {
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
        this.gyroscopeTimeStamp = this.global.transformTimeStamp(acceleration.timestamp,1);

        this.getGyroscopeDataSession(acceleration.x, acceleration.y,acceleration.z,this.gyroscopeTimeStamp);

        // intArray.push = acceleration.x;
        // this.gyroscopeSessionData.push = acceleration.y;
        // self.gyroscopeSessionData.push = acceleration.z;
        // intArray.push = this.gyroscopeTimeStamp;


        // var gyroscopeData = new Date(acceleration.timestamp);
        // var hours = gyroscopeData.getHours();
        // var minutes = "0" + gyroscopeData.getMinutes();
        // var seconds = "0" + gyroscopeData.getSeconds();
        // var milliseconds = "00" + gyroscopeData.getMilliseconds();
        //
        // // Will display time in 10:30:23.123 format
        // this.gyroscopeTimeStamp = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds.substr(-3);

        // this.gyroscopeTimeStamp = acceleration.timestamp;

      }, () => {

      }, options);

    // this.gyroscopeSessionData.push = intArray[0];

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

  private getGyroscopeDataSession (x:number,y:number,z:number,timestamp:any){

    this.global.gyroscopeSessionData.push(timestamp);
    this.global.gyroscopeSessionData.push(x.toFixed(5));
    this.global.gyroscopeSessionData.push(y.toFixed(5));
    this.global.gyroscopeSessionData.push(z.toFixed(5));


  }



}
