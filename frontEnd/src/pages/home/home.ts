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
  private timeLogWrite = 20; // interval of time to write log file in sec

  //=============
  // private stateStatus: string = "";s
  public stateName: string = "";
  public buttonText: string = "Drive";
  public isServiceStart: boolean = false;
  // private startOnlineCheck: boolean = false;
  private logSaveCounter: number = 0; // write log every 5 sec
  private wifiCheckCounter: number = this.timeWiFiCheck - 1; // check wifi name every 30 sec
  public clOnScreen3: any = "";
  // public clOnScreen: any = "";
  public isStorageFileExist: string;
  public stautusCheckGeneralCounter: number = 0;


  constructor(public navCtrl: NavController, public platform: Platform, public connectivityService: ConnectivityService,
              public serverService: ServerService, public accelerometerService: AccelerometerService, public gyroscopeService: GyroscopeService,
              public geoLocationService: GeoLocationService, public localDataSaveService: LocalDataSaveService, public global: Global) {

    this.onInit();
  }


  private onInit() {


    this.localDataSaveService.getPropertyObjFromFile().then(data => {
        // this.clOnScreen3 = JSON.stringify(this.global.propertyObj);
        this.global.sessionID = this.global.propertyObj.sessionId;
        this.global.ServerWifiName = this.global.propertyObj.ServerWifiName;

      if (!this.global.ServerWifiName) {this.checkForWiFiNameRegistred();
      } else {
        if (this.global.propertyObj.status) {
          this.startDrive();
        }
      }

      }
    );


  }


  public startDrive(): void {
    this.global.clOnScreen = "";

    if (this.global.ServerWifiName) {



      // ========= Start network connection checking
      // this.startOnlineCheck ? this.startOnlineCheck = false : this.startOnlineCheck = true;


      if (!this.isServiceStart) {
        this.buttonText = "Stop";

        this.isServiceStart = !this.isServiceStart;
        this.startAutoAppLaunch();
        this.checkOnlineStatus();

      } else {
        this.buttonText = "Drive";
        this.isServiceStart = !this.isServiceStart;
        this.stopAutoAppLaunch();

      }
    } else {

      // There is NO this.global.ServerWifiName
      this.global.clOnScreen = this.global.msg2;
      this.global.propertyObj.status = "Wait";
      this.checkForWiFiNameRegistred();

    }

  }

  checkOnlineStatus() {
    this.stautusCheckGeneralCounter++;

    this.global.clOnScreen8 = "GeneralCounter= " + this.stautusCheckGeneralCounter;
    setTimeout(() => {


      if (this.isServiceStart) {


        // =============== start collect log even if no right wifi connection

        if (this.logSaveCounter == this.timeLogWrite) {
          this.global.clOnScreen9 = "saveLog + counter=" + this.stautusCheckGeneralCounter;
          this.localDataSaveService.saveLog();
          // console.log("logSaveCounter reach " + this.timeLogWrite);
          this.logSaveCounter = 0;
        } else {
          this.logSaveCounter++;
        }

        // ============= is it time to check wifi again
        if (this.wifiCheckCounter == this.timeWiFiCheck) {

          // console.log("wifiCheckCounter reach " + this.timeWiFiCheck);
          this.wifiCheckCounter = 0;
          // this.connectivityService.getPhoneWiFiNameAndCheck(this.serverService.getServerWifiName());
          this.connectivityService.getPhoneWiFiNameAndCheck();
          // this.checkStatus();

        } else {
          this.wifiCheckCounter++;
          var remainingTimeWiFiCheck = this.timeWiFiCheck - this.wifiCheckCounter;
          // this.clOnScreen = 'WiFi check in ' + remainingTimeWiFiCheck + ' sec.ID= '+ this.global.sessionID;

          // cordova.plugins.backgroundMode.configure({
          //   text: 'WiFi check in ' + remainingTimeWiFiCheck + ' sec',
          // });
        }

        // start wifi check
        if (this.connectivityService.isWiFiNameCorrect) {

          // start data collection and change status to Record
          this.changeCollectionState("Record");


        } else {

          console.log("Wait for right connection");
          this.changeCollectionState("Wait");

        }

        // re-run online status check every 1 sec
        this.checkOnlineStatus();

      } else {

        // service stopped. Stop save log
        this.changeCollectionState("");
        this.logSaveCounter = 0;
        this.wifiCheckCounter = 0;


      }


    }, 1000)


  }


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
            this.changeStatusInBackGround();
            break;
          case 'Record':
            this.stateName = "Запись";
            this.global.stateStatus = "Record";
            this.global.sessionID++;
            this.localDataSaveService.saveAppPropertyToFile();
            this.changeStatusInBackGround();
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
      });
  }

  stopDataCollection() {
    this.accelerometerService.stopWatchAcceleration();
    this.gyroscopeService.stopWatchGyroscope();
    this.geoLocationService.stopWatchGeolocation();

    // save collected session data to server and to local file
    setTimeout(
      () => {
        // this.serverService.sendDataToServer();
        this.localDataSaveService.saveCSVFile();
        this.global.clOnScreen = "Сессия успешно записана в csv-файл "
      }, 1000
    );


  }

  private startAutoAppLaunch() {

    cordova.plugins.autoStart.enable(); // autostart app after phone re-boot
    this.platform.ready().then(
      () => {
        cordova.plugins.backgroundMode.setDefaults({
          text: 'Сбор данных' + this.stateName,
          title: 'Transporter',

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
  }

  changeStatusInBackGround() {

    cordova.plugins.backgroundMode.configure({
      text: 'Статус - ' + this.stateName,
    });

  }

  private stopAutoAppLaunch() {
    cordova.plugins.autoStart.disable();
    cordova.plugins.backgroundMode.disable();
  }

  private checkForWiFiNameRegistred(): any {

    // this.clOnScreen = "in checkForWiFiNameRegistred()";
    if (!this.global.ServerWifiName) {
       this.serverService.getServerWifiName().then(
        (result) => {
          if (result) {
            // this.clOnScreen = "checkForWiFiNameRegistred()=" + result;
            this.localDataSaveService.saveAppPropertyToFile();

            // check if previouse session was interupted
            if (this.global.propertyObj.status) {
              this.startDrive();
            }

            return result;
          } else {
            this.global.clOnScreen = this.global.msg1;
            return result;
          }
        }
      )
    }

  }

  // ======= file storage check ==============

  writePropertyFile() {


    // this.localDataSaveService.saveAppPropertyToFile();
    // this.localDataSaveService.getPropertyObjFromFile();
    // this.localDataSaveService.saveErrorLog(this.global.errContent);

  }


  // ===== promist functions ===========


}
