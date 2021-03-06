import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
// import {Geolocation} from 'ionic-native';
import {Global} from '../providers/global'

declare var navigator: any;

/*
 Generated class for the GeoLocationService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class GeoLocationService {
  public geolocationwatchID: any;

  public geolocationLatitude: number = 0;
  public geolocationLongitude: number = 0;
  public geolocationAccuracy: number = 0;
  public geolocationAltitude: number = 0;
  public geolocationAltitudeAccuracy: number = 0;
  public geolocationHeading: number = 0;
  public geolocationSpeed: number = 0;
  public geolocationTimeStamp: any = 0;


  constructor(public global: Global) {
    // console.log('Hello GeoLocationService Provider');
  }

  startWatchGeolocation() {

    this.geolocationwatchID = navigator.geolocation.watchPosition(
      (position)=> {

        this.geolocationLatitude = position.coords.latitude;
        this.geolocationLongitude = position.coords.longitude;
        this.geolocationAccuracy = position.coords.accuracy;
        this.geolocationAltitude = position.coords.altitude;
        this.geolocationAltitudeAccuracy = position.coords.altitudeAccuracy;
        this.geolocationHeading = position.coords.heading;
        this.geolocationSpeed = position.coords.speed;

        this.geolocationTimeStamp = this.global.transformTimeStamp(position.timestamp, 1);

        this.getGeoLocationSessionData(position.coords.latitude, position.coords.longitude, position.coords.accuracy,
          position.coords.altitude, position.coords.altitudeAccuracy, position.coords.heading, position.coords.speed, this.geolocationTimeStamp);

      },
      (error) => {

        // this.geolocationTimeStamp = "Error: " + error;
        this.global.saveErrorLog("startWatchGeolocation", "Error: " + error)
      },
      {enableHighAccuracy: true, maximumAge: 200, timeout: 60000});


    // ======================= native ionic
    // var options = {frequency: 200};  // Update every 200 miliseconds
    // var watchOptions = {
    //   frequency: 200,
    //   timeout: 30000,
    //   enableHighAccuracy: true // may cause errors if true
    // };
    //
    // this.geolocationwatchID = Geolocation.watchPosition(watchOptions).subscribe(
    //   (resp) => {
    //
    //
    //     // this.geolocationTimeStamp = resp.coords.latitude;
    //     // this.geolocationTimeStamp = "we are in subscribe";
    //     this.geolocationLatitude = resp.coords.latitude;
    //     this.geolocationLongitude = resp.coords.longitude;
    //     this.geolocationAccuracy = resp.coords.accuracy;
    //     this.geolocationAltitude = resp.coords.altitude;
    //     this.geolocationAltitudeAccuracy = resp.coords.altitudeAccuracy;
    //     this.geolocationHeading = resp.coords.heading;
    //     this.geolocationSpeed = resp.coords.speed;
    //
    //     this.geolocationTimeStamp = this.global.transformTimeStamp(resp.timestamp);
    //
    //   });


  }


  stopWatchGeolocation() {

    var geolocation = navigator.geolocation;
    geolocation.clearWatch(this.geolocationwatchID);

    // ================== native ionic

    // this.geolocationwatchID.unsubscribe();

    this.geolocationLatitude = 0;
    this.geolocationLongitude = 0;
    this.geolocationAccuracy = 0;
    this.geolocationAltitude = 0;
    this.geolocationAltitudeAccuracy = 0;
    this.geolocationHeading = 0;
    this.geolocationSpeed = 0;
    this.geolocationTimeStamp = "";

  }


  private getGeoLocationSessionData(Latitude, Longitude, Accuracy, Altitude, AltitudeAccuracy, Heading, Speed: number, TimeStamp: any) {

    this.global.geoLocationSessionData.push(TimeStamp);
    this.global.geoLocationSessionData.push(Latitude);
    this.global.geoLocationSessionData.push(Longitude);
    this.global.geoLocationSessionData.push(Speed);
    this.global.geoLocationSessionData.push(Heading);
    this.global.geoLocationSessionData.push(Altitude);
    this.global.geoLocationSessionData.push(Accuracy);
    this.global.geoLocationSessionData.push(AltitudeAccuracy);

  }


  checkGPSAvailability() {

    navigator.geolocation.getCurrentPosition(
      (position)=> {

        // if (position.timestamp) {
        //
        // }
        // // else  {
        // //   this.global.presentAlert("Check GPS", "GPS NOT available" + position.timestamp.toString() , "OKR");
        // // }

        this.global.isGPSAvailable = true;


      },
      ( PositionError) => {
        this.global.isGPSAvailable = false;
        // this.geolocationTimeStamp = "Error: " + error;
        // this.global.clOnScreen = this.global.msg4;
        this.global.saveErrorLog("checkGPSAvailability", "Error: " + JSON.stringify(PositionError));

      },
      {enableHighAccuracy: true, maximumAge: 200, timeout: 10000}
    )
  }

}
