import {Component} from '@angular/core';
import {NavController, Alert, Platform} from 'ionic-angular';

// import {Network} from 'ionic-native';
import {ConnectivityService} from '../../providers/connectivity-service';
import {AccelerometerService} from '../../providers/accelerometer-service'
import {GyroscopeService} from '../../providers/gyroscope-service'
import {GeoLocationService} from '../../providers/geo-location-service'
import {ServerService} from '../../providers/server-service';
import {LocalDataSaveService} from '../../providers/local-data-save-service'
import {Global} from '../../providers/global'
// import {BackgroundMode} from 'ionic-native';

// declare var cordova:any;

// declare var window: any;
declare var cordova: any;
// // declare var Connection: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // ===== configuration variables ========
  private timeWiFiCheck: number = 15; // interval of time to check if wifi available in sec
  private timeLogWrite = 5; // interval of time to write log file in sec

  //=============
  // private stateStatus: string = "";
  public stateName: string = "";
  public buttonText: string = "Drive";
  public isServiceStart: boolean = false;
  // private startOnlineCheck: boolean = false;
  private logSaveCounter: number = 0; // write log every 5 sec
  private wifiCheckCounter: number = 0; // check wifi name every 30 sec
  public clOnScreen3: any = "";
  public clOnScreen: any = "";
  public isStorageFileExist: string;
  public stautusCheckGeneralCounter: number = 0;


  constructor(public navCtrl: NavController, public platform: Platform, public connectivityService: ConnectivityService,
              public serverService: ServerService, public accelerometerService: AccelerometerService, public gyroscopeService: GyroscopeService,
              public geoLocationService: GeoLocationService, public localDataSaveService: LocalDataSaveService, public global: Global) {

    this.onInit();
  }


  private onInit() {


    this.localDataSaveService.getPropertyObjFromFile().toPromise().then(data => {
        this.clOnScreen3 = JSON.stringify(this.global.propertyObj);


      }
    );


    // Promise.all([this.localDataSaveService.getPropertyObjFromFile()]).then(data => {
    //   this.clOnScreen3 = JSON.stringify(this.global.propertyObj);
    //
    //
    // });


  }

  public startDrive(): void {

    // ========= Start network connection checking
    // this.startOnlineCheck ? this.startOnlineCheck = false : this.startOnlineCheck = true;


    if (!this.isServiceStart) {
      this.buttonText = "Stop";

      this.isServiceStart = !this.isServiceStart;

      cordova.plugins.autoStart.enable(); // autostart app after phone re-boot
      this.platform.ready().then(
        () => {
          cordova.plugins.backgroundMode.setDefaults({
            title: 'Transporter',
            text: 'Status' + this.stateName,
            resume: true,
          });

          cordova.plugins.backgroundMode.enable();

          // cordova.plugins.backgroundMode.onactivate = function () {
          //     cordova.plugins.backgroundMode.configure({
          //       text:'WiFi check in ' + + ' sec',
          //     });
          //
          //   // setTimeout(function () {
          //   //   // Modify the currently displayed notification
          //   //   cordova.plugins.backgroundMode.configure({
          //   //     text:'In background for more than 5s now.'
          //   //   });
          //   // }, 5000);
          // };
        }
      );

      // this.checkStatus();

      this.checkOnlineStatus();

    } else {
      this.buttonText = "Drive";
      this.isServiceStart = !this.isServiceStart;
      // this.changeCollectionState("");
      cordova.plugins.autoStart.disable();
      cordova.plugins.backgroundMode.disable();
      // this.changeCollectionState("Wait");
      // BackgroundMode.disable();

    }


  }

  checkOnlineStatus() {
    this.stautusCheckGeneralCounter++;

    setTimeout(() => {


      if (this.isServiceStart) {


        // start collect log even if no right wifi connection

        if (this.logSaveCounter == this.timeLogWrite) {
          // this.localDataSaveService.saveLog();
          console.log("logSaveCounter reach " + this.timeLogWrite);
          this.logSaveCounter = 0;
        } else {
          this.logSaveCounter++;
        }

        // start wifi check
        if (this.connectivityService.isWiFiNameCorrect) {

          // start data collection and change status to Record
          this.changeCollectionState("Record");


          // is it time to check wifi again
          if (this.wifiCheckCounter == this.timeWiFiCheck) {

            // console.log("wifiCheckCounter reach " + this.timeWiFiCheck);
            this.wifiCheckCounter = 0;
            this.connectivityService.getPhoneWiFiNameAndCheck(this.serverService.getServerWifiName());
            // this.checkStatus();

          } else {
            this.wifiCheckCounter++;
            var remainingTimeWiFiCheck = this.timeWiFiCheck - this.wifiCheckCounter;
            this.clOnScreen = 'WiFi check in ' + remainingTimeWiFiCheck + ' sec';

            // cordova.plugins.backgroundMode.configure({
            //   text: 'WiFi check in ' + remainingTimeWiFiCheck + ' sec',
            // });
          }

          // this.checkOnlineStatus();

        } else {

          console.log("Wait for right connection");
          this.changeCollectionState("Wait");
          this.wifiCheckCounter = 0;
          this.connectivityService.getPhoneWiFiNameAndCheck(this.serverService.getServerWifiName());

        }
        // re-run online status check every 1 sec
        this.checkOnlineStatus();

      } else {

        // service stopped. Stop save log
        this.changeCollectionState("");
        this.logSaveCounter = 0;

        setTimeout(
          () => {
            this.serverService.sendLogDataToServer();
            this.clOnScreen = "Data send to server and write to file"
          }, 500
        );


      }


    }, 1000)


  }


  // checkStatus() {
  //   if (this.connectivityService.isOnline()) {
  //
  //     if (this.connectivityService.isWiFiConnection()) {
  //
  //       // check WiFi name with wifiName received from server by IMEI
  //       this.connectivityService.getPhoneWiFiNameAndCheck(this.serverService.getServerWifiName());
  //
  //
  //       if (this.connectivityService.isWiFiNameCorrect) {
  //
  //         // if ( this.connectivityService.isWiFiNameCorrect) {
  //         this.clOnScreen = "it is correct wifi name";
  //         // }
  //
  //         if (this.stateStatus != "Record") {
  //           this.changeCollectionState("Record");
  //         }
  //
  //       } else {
  //         if (this.stateStatus == "Record" || this.stateStatus == "") this.changeCollectionState("Wait");
  //       }
  //     } else {
  //       if (this.stateStatus == "Record" || this.stateStatus == "") this.changeCollectionState("Wait");
  //     }
  //   } else {
  //     console.log("WE are OFFLINE");
  //     if (this.stateStatus == "Record" || this.stateStatus == "") this.changeCollectionState("Wait");
  //   }
  //
  // }


  private changeCollectionState(x: string): void {
    if (x === undefined) {
      this.stateName = "";
      this.global.stateStatus = "";
    } else {
      if (x != this.global.stateStatus) {
        switch (x) {
          case 'Wait':
            if (this.global.stateStatus == "Record") this.stopDataCollection();
            this.stateName = "Ожидание";
            this.global.stateStatus = "Wait";
            this.localDataSaveService.saveAppPropertyToFile();
            break;
          case 'Record':
            this.stateName = "Запись";
            this.global.stateStatus = "Record";
            this.localDataSaveService.saveAppPropertyToFile();
            this.startDataCollection();
            break;
          default:
            if (this.global.stateStatus == "Record") this.stopDataCollection();
            this.stateName = "";
            this.global.stateStatus = "";
            this.localDataSaveService.saveAppPropertyToFile();

        }
      }
    }

  }

  startDataCollection() {

    this.platform.ready().then(
      () => {
        this.accelerometerService.startWatchAcceleration();
        this.gyroscopeService.startWatchGyroscope();
        this.geoLocationService.startWatchGeolocation();
        // this.clOnScreen3 = this.gyroscopeService.gyroscopeX;
        setTimeout(
          () => {
            this.clOnScreen3 = this.gyroscopeService.GyroscopeData[0];
          }, 500
        );


      });
  }

  stopDataCollection() {
    this.accelerometerService.stopWatchAcceleration();
    this.gyroscopeService.stopWatchGyroscope();
    this.geoLocationService.stopWatchGeolocation();
  }

  // ======= file storage check ==============

  writePropertyFile() {

    // this.localDataSaveService.saveAppPropertyToFile();
    this.localDataSaveService.getPropertyObjFromFile();

  }


  // ===== promist functions ===========



}
