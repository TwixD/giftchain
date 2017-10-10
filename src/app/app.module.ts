import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { GiftSlider } from '../pages/gift-slider/gift-slider';
import { GiftChoice } from '../pages/gift-choice/gift-choice';

import { FirebaseAppService } from '../providers/firebase/firebase.service';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { phoneFormatter } from '../directives/phone.directive';

import { productSlide } from '../components/product-slider.component';

import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';



export const firebaseConfig = {
  apiKey: "AIzaSyCNTMkTS5rKwrteoOAH6zqaA5iCCw5FtLE",
  authDomain: "giftchain-f0e7e.firebaseapp.com",
  databaseURL: "https://giftchain-f0e7e.firebaseio.com",
  storageBucket: "giftchain-f0e7e.appspot.com",
  messagingSenderId: '834720898409'
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    GiftSlider,
    GiftChoice,
    phoneFormatter,
    productSlide
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Login,
    GiftSlider,
    GiftChoice,
    productSlide
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    FirebaseAppService,
    File,
    FileTransfer,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
