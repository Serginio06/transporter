import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ConnectivityService} from '../providers/connectivity-service';
import {ServerService} from '../providers/server-service';
import {LocalDataSaveService} from '../providers/local-data-save-service';
import {GyroscopeService} from '../providers/gyroscope-service';
import {GeoLocationService} from '../providers/geo-location-service';
import {AccelerometerService} from '../providers/accelerometer-service';
import {Global} from '../providers/global';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '720b0145'
  }
};


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  }, ConnectivityService, ServerService, LocalDataSaveService, GyroscopeService, GeoLocationService
    , AccelerometerService, Global]
  // providers: []
})
export class AppModule {
}
