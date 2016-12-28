import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular'
import {DeviceMotion} from 'ionic-native';
import {Global} from '../providers/global'
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
 Generated class for the AccelerometerService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class AccelerometerService {
  public accelerationX: number = 0;
  public accelerationY: number = 0;
  public accelerationZ: number = 0;
  public accelerationTimeStamp: any = 0;
  public accelerationID: any;


  constructor(public platform: Platform, public global:Global) {
    console.log('Hello AccelerometerService Provider');


  }

  startWatchAcceleration() {

    var options = {frequency: 200};  // Update every 200 miliseconds

    this.accelerationID = DeviceMotion.watchAcceleration(options).subscribe(
      (acceleration) => {
        this.accelerationX = acceleration.x;
        this.accelerationY = acceleration.y;
        this.accelerationZ = acceleration.z;
        this.accelerationTimeStamp = this.global.transformTimeStamp(acceleration.timestamp);

        // var accelerationData = new Date(acceleration.timestamp);
        // var hours = accelerationData.getHours();
        // var minutes = "0" + accelerationData.getMinutes();
        // var seconds = "0" + accelerationData.getSeconds();
        // var milliseconds = "00" + accelerationData.getMilliseconds();
        //
        // // Will display time in 10:30:23.123 format
        // this.accelerationTimeStamp = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milliseconds.substr(-3);


      });

  }

  stopWatchAcceleration() {
    console.log("this is stopWatchAcceleration");

    this.accelerationID.unsubscribe();
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.accelerationZ = 0;
    this.accelerationTimeStamp = 0;
  }

}
