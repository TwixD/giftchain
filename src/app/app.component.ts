import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Keyboard } from '@ionic-native/keyboard';

import { Login } from '../pages/login/login';
import { GiftStatus } from '../pages/gift-status/gift-status';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myMainNav') nav;
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public nativeStorage: NativeStorage,
    public keyboard: Keyboard) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.keyboard.disableScroll(true);
      statusBar.styleDefault();
      splashScreen.hide();
      this.route();
    });
  }

  route() {
    this.loadPreviousData().then((res) => {
      if (res) {
        this.nav.setRoot(GiftStatus, res);
      } else {
        this.nav.setRoot(Login);
      }
    });
  }

  loadPreviousData(): Promise<any> {
    return new Promise((resolve) => {
      this.nativeStorage.getItem('user').then((data) => {
        resolve(data);
      }).catch((error) => {
        resolve(null);
      });
    });
  }

}

