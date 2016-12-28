import {Injectable} from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {File} from 'ionic-native';
import {Platform} from 'ionic-angular'
import {Global} from '../providers/global'

/*
 Generated class for the LocalDataSaveService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare var cordova: any;
// declare var window: any;


@Injectable()
export class LocalDataSaveService {
  // ===== configuratioin

  public appPropertyDirectory:string = "file:///storage/emulated/0/";
  public appPropertyFile = "TransporterProp.txt";


  // ==============
  // public returnCheckFile: any;
  public clOnScreen5: any = "";


  constructor(public platform: Platform, public global:Global) {
    console.log('Hello LocalDataSaveService Provider');
    // var this.platform = platform;

  }


  public saveAppPropertyToFile(): void {

    // var currentDate = new Date;
    // var fileName = "test" + currentDate.toDateString() + ".txt";


    // let folderpath = cordova.file.externalApplicationStorageDirectory;
    let folderpath = cordova.file.externalDataDirectory;

    // let folderpath = "file:///storage/emulated/0/";

    // var statusObj:any;

    // this.global.propertyObj.status = status;


    this.global.propertyObj.sessionId = this.global.sessionID;
    this.global.propertyObj.status = this.global.stateStatus;
    this.clOnScreen5 = JSON.stringify( this.global.propertyObj);

    // this.returnCheckFile = "fileName:" + fileName;

    // this.platform.ready().then(
    //   () => {


        File.writeFile(
          this.appPropertyDirectory,
          this.appPropertyFile,
          JSON.stringify( this.global.propertyObj),
          {replace: true}
        );


    //   }
    // );

  }

  public getPropertyObjFromFile(): any{

    var parsedObj:any;

    return this.platform.ready().then(
      () => {
        return File.readAsText(
          this.appPropertyDirectory,
          this.appPropertyFile
        ).then(
          (filedata) => {

            this.global.propertyObj = JSON.parse(filedata.toString());

            return this.global.propertyObj;

            // if ( !this.global.propertyObj.status ) { this.clOnScreen5 = "there is no status property" }
            // if ( !this.global.propertyObj.sessionId ) { this.clOnScreen5 = "there is no sessionId property" }
            //
            // if ( this.global.propertyObj.status && this.global.propertyObj.sessionId ) {
            //   this.clOnScreen5 = "From file: " + this.global.propertyObj.status + ":" + this.global.propertyObj.sessionId ;
            // }



          }
        );
      }
    );

  }

  updateSessionID ():boolean {

return true;

  }

  saveLog() {


  }


}
