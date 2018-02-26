import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';
import { Keyboard } from '@ionic-native/keyboard';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Login } from '../pages/login/login';
import { GiftStatus } from '../pages/gift-status/gift-status';
import { WelcomePage } from '../pages/welcome/welcome';
import { FirebaseAppService } from '../providers/firebase/firebase.service';
import { GiftContacts } from '../pages/gift-contacts/gift-contacts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myMainNav') nav;
  rootPage: any;
  imageProp: string = 'imagen';
  products: Array<Object> = [];
  settings: Object = {};

  constructor(public platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen,
    public nativeStorage: NativeStorage,
    public keyboard: Keyboard,
    public firebaseAppService: FirebaseAppService,
    public transfer: FileTransfer,
    public file: File) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.keyboard.disableScroll(true);
      statusBar.styleDefault();
      this.route();
    });
  }

  route() {
    // this.nav.setRoot(GiftContacts, {});
    this.loadProducts().then(() => {
      this.loadSettings().then(() => {
        this.loadPreviousData().then((res) => {
          this.splashScreen.hide();
          let data: Object = {
            'products': this.products,
            'settings': this.settings
          };
          if (res) {
            data['user'] = res;
            this.nav.setRoot(GiftStatus, data);
          } else {
            this.nav.setRoot(WelcomePage, data);
          }
        });
      })
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

  loadProducts(): Promise<boolean> {
    return new Promise((resolve) => {
      let counter: number = 0;
      try {
        this.firebaseAppService.query('/productos', 'habilitado', true).then((data) => {
          if (data) {
            for (let key in data) {
              let product = Object.assign({}, data[key]);
              if (this.imageProp in product) {
                let fileName: string = product[this.imageProp];
                this.firebaseAppService.getStorageFileUrl(fileName).then((fileURL) => {
                  product['imgUrl'] = fileURL;
                  this.loadProductImage(product).then((res) => {
                    counter++;
                    if (counter == data.length) {
                      resolve(true);
                    }
                  });
                }).catch((error) => {
                  counter++;
                  if (counter == data.length) {
                    resolve(true);
                  }
                });
              } else {
                counter++;
                if (counter == data.length) {
                  resolve(true);
                }
              }
              this.products.push(product);
            }
          } else {
            resolve(false);
          }
        });
      } catch (error) {
        console.error(`[loadProducts]`, error);
        resolve(false);
      }
    });
  }

  loadSettings(): Promise<any> {
    return new Promise((resolve) => {
      this.firebaseAppService.query('/settings', null, null, true).then((data: Object) => {
        this.settings = data;
        resolve(true);
      }).catch((error) => {
        console.error(`[MyApp] [loadSettings] Firebase ERROR`, error);
        resolve(false);
      });
    });
  }

  loadProductImage(product: Object): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // const fileTransfer: FileTransferObject = this.transfer.create();
        // fileTransfer.download(product['imgUrl'], `${this.file.dataDirectory}${product['imagen']}`).then((entry) => {
        //   product['imgUrlLocal'] = entry.toURL();
        //   resolve(true);
        // }).catch((error) => {
        //   console.error(`[loadProductImage]`, error);
        //   resolve(false);
        // });
        //FIX THIS
        resolve(true);
      } catch (error) {
        console.error(`[loadProductImage]`, error);
        resolve(false);
      }
    });
  }

}

