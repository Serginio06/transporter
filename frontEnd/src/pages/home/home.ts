import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {PowerManagement} from "ionic-native";

// import {Network} from 'ionic-native';
import {ConnectivityService} from '../../providers/connectivity-service';
import {AccelerometerService} from '../../providers/accelerometer-service'
import {GyroscopeService} from '../../providers/gyroscope-service'
import {GeoLocationService} from '../../providers/geo-location-service'
import {ServerService} from '../../providers/server-service';
import {LocalDataSaveService} from '../../providers/local-data-save-service'
import {Global} from '../../providers/global'
import 'rxjs/Rx';
// import {BackgroundMode} from 'ionic-native';

// declare var cordova:any;

// declare var window: any;
declare var cordova: any;
// declare var powerManagement:any;
// declare var window:any;
// declare let WifiWizard: any;
// // declare var Connection: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // ===== configuration variables ========

  public timeWiFiCheck: number = 15; // interval of time to check if wifi available in sec
  public timeLogWrite = 10; // interval of time to write log file in sec
  public buttonText: string = "Drive";
  public timeErrLogWrite = 90; // interval of time to send errLog to server in sec


  //=============
  // private stateStatus: string = "";s
  public stateName: string = "";
  public isServiceStart: boolean = false;
  // private startOnlineCheck: boolean = false;
  private logSaveCounter: number = 0; // counter before save log
  public wifiCheckCounter: number = this.timeWiFiCheck - 1; // counter before save data
  private errLogCheckCounter: number = 0; // counter before save data
  private sensorCheckButton: string = "";

  private clOnScreen3: any = "";
  public stautusCheckGeneralCounter: number = 0;


  constructor(public navCtrl: NavController, public platform: Platform, public connectivityService: ConnectivityService,
              public serverService: ServerService, public accelerometerService: AccelerometerService, public gyroscopeService: GyroscopeService,
              public geoLocationService: GeoLocationService, public localDataSaveService: LocalDataSaveService, public global: Global) {

    this.onInit();
  }


  public onInit() {

    this.localDataSaveService.getPropertyObjFromFile().then(data => {

        this.global.sessionID = this.global.propertyObj.sessionId || 0;
        this.global.ServerWifiName = this.global.propertyObj.ServerWifiName || "";
        this.global.isAllSensorAvailable = this.global.propertyObj.isAllSensorAvailable || "empty";

        if (this.global.isAllSensorAvailable == "empty" || this.global.isAllSensorAvailable == "") {
          this.checkSensorsOnInit();
        } else {
          this.checkDataFromPropertyFile();
        }

      }
    );
  }

  private checkDataFromPropertyFile() {

    if (!this.global.ServerWifiName) {
      this.checkForWiFiNameRegistred();
    } else {
      if (this.global.propertyObj.status) {
        this.startDrive();
      }
    }

  }

  private checkSensorsOnInit() {


    this.checkSensors().then(
      (result) => {

        this.global.dismissLoadingSpinner();

        if (result.code == 1 || result.code == 2) {

          // this.global.presentAlert("Check sensors", "All sensors found", "OK");
          this.sensorCheckButton = "";
          this.checkDataFromPropertyFile();

        }
        // else if (result.code == 2) {
        //   this.global.presentAlert("Check sensors", "No needed sensors. Please uninstall application", "Exit");
        // }
        else if (result.code == 3 && this.sensorCheckButton == "") {
          this.global.presentAlert("Check sensors", "GPS not found. Please make sure that GPS is on and application has permission to use it", "OK");
          this.sensorCheckButton = "Check sensors again";
        } else if (result.code == 3 && this.sensorCheckButton != "") {
          this.global.presentAlert("Check sensors", "No needed sensors. Please uninstall application", "Exit");
          this.sensorCheckButton = "";
        }
      }
    )
  }


  public startDrive(): void {
    this.global.clOnScreen = "";
    // this.global.clOnScreen = "start of startDrive()";

    if (this.global.isAllSensorAvailable != "true") {
      // this.global.clOnScreen = "check for sensors availability startDrive()";
      this.global.saveErrorLog("startDrive()", "We go to startDrive without sensors check for some reason");
      this.checkSensorsOnInit();

    } else {
      // this.global.clOnScreen = "serverWiFIName check start";

      if (this.global.ServerWifiName) {

        // ========= Start network connection checking
        // this.clOnScreen3 = "this.isServiceStart=" + this.isServiceStart;

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
  }

  public checkOnlineStatus() {
    this.stautusCheckGeneralCounter++;

    this.global.clOnScreen8 = "GeneralCounter= " + this.stautusCheckGeneralCounter;

    setTimeout(() => {


      if (this.isServiceStart) {

        // =============== start collect log even if no right wifi connection
        if (this.logSaveCounter == this.timeLogWrite) {

          // this.global.clOnScreen9 = "saveLog + counter=" + this.stautusCheckGeneralCounter;
          this.localDataSaveService.saveLog();
          // console.log("logSaveCounter reach " + this.timeLogWrite);
          this.logSaveCounter = 0;
        } else {
          this.logSaveCounter++;
        }

        // ================= countdown to send errLog to server =============
        // if (this.errLogCheckCounter == this.timeErrLogWrite) {
        //   // this.clOnScreen =
        //   this.global.clOnScreen10 = "saveErrLog file=" + this.global.errLogContent;
        //
        //   this.global.errLogContent ? this.serverService.sendErrLogToServer(this.global.errLogContent) : "";
        //
        //   this.errLogCheckCounter = 0;
        // } else {
        //   this.errLogCheckCounter++;
        // }
        this.global.clOnScreen10 = "wifiCheckCounter= " + this.wifiCheckCounter;
        // ============= is it time to check wifi again
        if (this.wifiCheckCounter == this.timeWiFiCheck) {
          this.global.clOnScreen10 = "checking wifi + " + this.stautusCheckGeneralCounter;
          this.wifiCheckCounter = 0;
          this.connectivityService.getPhoneWiFiNameAndCheck();

        } else {
          this.wifiCheckCounter++;
          this.global.clOnScreen10 = "Not checking wifi";
        }

        // start wifi check
        if (this.connectivityService.isWiFiNameCorrect) {
          // this.global.clOnScreen = "isWiFiNameCorrect" + this.connectivityService.isWiFiNameCorrect;
          // start data collection and change status to Record
          this.changeState("Record");


        } else {

          // console.log("Wait for right connection");
          this.changeState("Wait");

        }

        // re-run online status check every 1 sec
        this.checkOnlineStatus();

      } else {

        // service stopped. Stop save log
        this.changeState("");
        this.logSaveCounter = 0;
        this.wifiCheckCounter = 0;


      }


    }, 1000)


  }


  private changeState(x: string): void {
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
            this.changeStatusInBackGround();
            this.localDataSaveService.saveAppPropertyToFile();
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
            // this.global.clOnScreen = "we are in default changeState: " + x;
            if (this.global.stateStatus == "Record") this.stopDataCollection();
            this.stateName = "";
            this.global.stateStatus = "";
            this.localDataSaveService.saveAppPropertyToFile();

        }
      }
    }

  }

  private startDataCollection() {

    this.platform.ready().then(
      () => {

        // if (!!cordova) this.global.saveErrorLog("!!cordova",'DEBUG || ' + JSON.stringify(cordova.plugins));
        // if (!!window.plugins)  this.global.saveErrorLog("!!window.plugins",'DEBUG || ' + JSON.stringify(window.plugins));

        // try{
        // this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(powerManagement);
        //   this.global.saveErrorLog("cordova.plugins", "powerManagement= " + JSON.stringify(powerManagement));
        //
        // }
        // catch (err) {
        //   this.global.clOnScreen9 = "catch-err -> cordova= " + err;
        //   this.global.saveErrorLog("cordova.plugins", "catch-err -> cordova= " + err);
        //
        // }

        // try{
        // this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(PowerManagement);
        //   this.global.saveErrorLog("powerManagement", "PowerManagement= " + JSON.stringify(PowerManagement));
        //
        // }
        // catch (err) {
        //   this.global.clOnScreen9 = "catch-err -> powerManagement= " + err;
        //   this.global.saveErrorLog("powerManagement", "catch-err -> powerManagement= " + err);
        //
        // }
        // try{
        // this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(window.plugins.PowerManagement);
        //   this.global.saveErrorLog("powerManagement", "window.plugins.PowerManagement= " + JSON.stringify(window.plugins.PowerManagement));
        //
        // }
        // catch (err) {
        //   this.global.clOnScreen9 = "catch-err -> window.plugins.PM= " + err;
        //   this.global.saveErrorLog("powerManagement", "catch-err -> window.plugins.PM= " + err);
        //
        // }
        // try{
        //   this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(window.plugins);
        //   this.global.saveErrorLog("powerManagement", "window.plugins= " + JSON.stringify(window.plugins));
        // }
        // catch (err) {
        //   this.global.clOnScreen9 = "catch-err -> window.plugins= " + err;
        //   this.global.saveErrorLog("powerManagement", "catch-err -> window.plugins= " + err);
        // }
        // try {
        //   this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(window.PowerManagement);
        //   this.global.saveErrorLog("powerManagement", "window.PowerManagement= " + JSON.stringify(window.PowerManagement));
        // }
        // catch (err) {
        //   this.global.clOnScreen9 = "catch-err -> window.plugins= " + err;
        //   this.global.saveErrorLog("powerManagement", "catch-err -> window.plugins= " + err);
        // }
        // try {
        //   this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(window.powerManagement);
        //   this.global.saveErrorLog("powerManagement", "window.powerManagement= " + JSON.stringify(window.powerManagement));
        // }
        // catch (err) {
        //   this.global.clOnScreen9 = "catch-err -> window.powerManagement= " + err;
        //   this.global.saveErrorLog("powerManagement", "catch-err -> window.powerManagement= " + err);
        // }


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
        // this.global.clOnScreen = "Сессия успешно записана в csv-файл ";
        // this.global.clOnScreen = this.global.msg9;
      }, 1000
    );


  }

  private startAutoAppLaunch() {

    try {
      this.global.saveErrorLog("startAutoAppLaunch", "Start Function");
      var defaultBackgroundStateName = "Сбор данных";

      if (this.stateName != "") {
        defaultBackgroundStateName = this.stateName;
      } else if (this.global.stateStatus != "") {
        defaultBackgroundStateName = "this.global.stateStatus: " + this.global.stateStatus;
      } else {
        defaultBackgroundStateName = "Сбор данных";
      }


      this.platform.ready().then(
        () => {

          // this.global.saveErrorLog("startAutoAppLaunch","Plarform Ready" );
          cordova.plugins.autoStart.enable(); // autostart app after phone re-boot
          // this.global.saveErrorLog("startAutoAppLaunch","After autostart Enable" );
          cordova.plugins.backgroundMode.setDefaults({
            text: defaultBackgroundStateName,
            title: 'CHERRY',
            icon: "icon",
            ticker: defaultBackgroundStateName,
            color: '#9f4a9d',
            isPublic: true,
            resume: true,
          });

          // cordova.plugins.backgroundMode.enable();
          // this.global.clOnScreen9 = "before platform check";
          // this.global.saveErrorLog("startAutoAppLaunch","before platform check" );

          if (this.platform.is('android')) {
            // this.global.saveErrorLog("startAutoAppLaunch","after platform Android check" );
            cordova.plugins.backgroundMode.enable();


            // try{
            //   this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(powerManagement);
            //   this.global.saveErrorLog("cordova.plugins", "powerManagement= " + JSON.stringify(powerManagement));
            //
            // }
            // catch (err) {
            //   this.global.clOnScreen9 = "catch-err -> cordova= " + err;
            //   this.global.saveErrorLog("cordova.plugins", "catch-err -> cordova= " + err);
            //
            // }

            // this.global.clOnScreen9 = "powerManagement.dim";
            // this.global.saveErrorLog("startAutoAppLaunch","before platform check" );
            // this.global.saveErrorLog("startAutoAppLaunch","window= " + window );
            // this.global.saveErrorLog("startAutoAppLaunch","window.powerManagement= " + JSON.stringify(PowerManagement) );
            // this.global.clOnScreen9 = "powerManagement= " + JSON.stringify(PowerManagement);
            // powerManagement.dim(function () {
            //   // console.log('Wakelock acquired');
            //   this.global.saveErrorLog("startAutoAppLaunch", "Wakelock acquired");
            // }, function () {
            //   // console.log('Failed to acquire wakelock');
            //   this.global.saveErrorLog("startAutoAppLaunch", "Failed to acquire wakelock");
            // });
            // powerManagement.setReleaseOnPause(false, function () {
            //   // console.log('setReleaseOnPause successfully');
            //   this.global.saveErrorLog("startAutoAppLaunch", "setReleaseOnPause successfully");
            // }, function () {
            //   // console.log('Failed to set');
            //   this.global.saveErrorLog("startAutoAppLaunch", "Failed to set");
            // });

            PowerManagement.dim().then(
              () => {
                this.global.clOnScreen9 = "Wakelock acquired";
                this.global.saveErrorLog("startAutoAppLaunch", "Wakelock acquired");
              }
            ).catch(
              (err) => {
                this.global.clOnScreen9 = "Failed to acquire wakelock: " + JSON.stringify(err);
                this.global.saveErrorLog("startAutoAppLaunch", "Failed to acquire wakelock: " + JSON.stringify(err) );
              }
            );

            PowerManagement.setReleaseOnPause(false).then(
              () => {
                this.global.clOnScreen9 = "setReleaseOnPause successfully";
                this.global.saveErrorLog("startAutoAppLaunch", "setReleaseOnPause successfully");
              }
            ).catch(
              (err) => {
                this.global.clOnScreen9 = "Failed to set: " + JSON.stringify(err);
                this.global.saveErrorLog("startAutoAppLaunch", "Failed to set: " + JSON.stringify(err) );
              }
            );



          }


        }
      );

    }
    catch (err) {
      this.global.saveErrorLog("startAutoAppLaunch", "try-catch" + err);
    }
  }

  private changeStatusInBackGround() {
    // this.clOnScreen3 = "changeStatusInBackGround= " + this.stateName;

    // this.platform.ready().then(
    //   () => {
    //     cordova.plugins.backgroundMode.configure({
    //       text: 'Статус - ' + this.stateName,
    //       ticker: this.stateName,
    //       isPublic: true,
    //     });
    //   }
    // );

  }

  private stopAutoAppLaunch() {

    this.platform.ready().then(
      () => {
        cordova.plugins.autoStart.disable();
        cordova.plugins.backgroundMode.disable();

        PowerManagement.release().then(
          () => {
            this.global.clOnScreen9 = "release wakelock successfully";
            this.global.saveErrorLog("startAutoAppLaunch", "release wakelock successfully");
          }
        ).catch(
          (err) => {
            this.global.clOnScreen9 = "Failed to release wakelock: " + JSON.stringify(err);
            this.global.saveErrorLog("startAutoAppLaunch", "Failed to release wakelock: " + JSON.stringify(err) );
          }
        );

      }
    );
  }

  private checkForWiFiNameRegistred(): any {

    // this.clOnScreen = "in checkForWiFiNameRegistred()";
    if (!this.global.ServerWifiName) {
      this.serverService.getServerWifiName().then(
        (result) => {
          if (result) {
            // this.clOnScreen = "checkForWiFiNameRegistred()=" + isGyroscopeAvailable;
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

  private checkSensors(): any {


    this.global.presentLoadingSpinner(this.global.spinnerSensorCheckMsg);

    return new Promise(resolve => {

        this.gyroscopeService.checkGyroscopeAvailability();
        this.geoLocationService.checkGPSAvailability();

        setTimeout(function () {
            //


            if (this.global.isGyroscopeAvailable && this.global.isGPSAvailable) {
              // this.global.presentAlert("Check sensors", "All sensors found", "OK");
              this.global.isAllSensorAvailable = "true";
              resolve({code: 1, status: "All needed sensors have been found"});
            } else if (!this.global.isGyroscopeAvailable) {
              // this.global.presentAlert("Check sensors", "Gyroscope not found", "OK");
              this.global.isAllSensorAvailable = "true";
              resolve({code: 2, status: "Gyroscope has not been found"});
            } else if (!this.global.isGPSAvailable) {
              // this.global.presentAlert("Check sensors", "GPS not found", "OK");
              this.global.isAllSensorAvailable = "false";

              resolve({code: 3, status: "GPS has not been found or it is off"});
            }

            // this.localDataSaveService.saveAppPropertyToFile();
          }.bind(this)

          , 3000);

      }
    );

  }


  // ===== promist functions ===========


}
