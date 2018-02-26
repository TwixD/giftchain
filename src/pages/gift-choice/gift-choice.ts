import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { GiftContacts } from '../gift-contacts/gift-contacts';
import { GiftStatus } from '../gift-status/gift-status';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment-timezone';
declare var cordova: any;

@Component({
  selector: 'gift-choice',
  templateUrl: 'gift-choice.html',
})
export class GiftChoice {

  product: Object;
  settings: Object;
  user: Object = {
    'nombre': null,
    'telefono': null,
  };

  constructor(public params: NavParams,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public firebaseAppService: FirebaseAppService,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public nativeStorage: NativeStorage,
    public platform: Platform) {
    this.user = params.get('user') || this.user;
    this.product = params.get('product');
    this.settings = params.get('settings');
  }

  ngOnInit() {
    this.setDates();
  }

  setDates() {
    let utcMoment = moment().utc();
    this.user['fecha_comienzo'] = utcMoment.tz('America/New_York').format('YYYY-MM-DD');
    this.user['fecha_comienzo_format'] = utcMoment.tz('America/New_York').format('MMMM Do YYYY');
    this.user['fecha_fin'] = utcMoment.tz('America/New_York').add(15, 'd').format('YYYY-MM-DD');
    this.user['fecha_fin_format'] = utcMoment.tz('America/New_York').format('MMMM Do YYYY');
  }

  back() {
    this.navCtrl.pop();
  }

  accept() {
    let message: Array<string> = [];
    let validateProps: Object = {
      'nombre': 'Nombre(Dueño de la Lista)',
      'telefono': 'Teléfono'
    };
    for (let prop in validateProps) {
      if (!this.user[prop]) {
        message.push(validateProps[prop]);
      }
    }
    if (message.length > 0) {
      let toast = this.toastCtrl.create({
        message: `Los campos ${message.join(", ")} son necesarios!`,
        duration: 4000
      });
      toast.present();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Por favor espere..."
      });
      loader.present();
      this.user['telefono'] = this.user['telefono'].replace(/[^0-9]/g, '');
      this.valiteUser().then((userStatus: Object) => {
        loader.dismiss().then(() => {
          let userType: number = userStatus ? userStatus['type'] : 0;
          let paramOb: Object = {
            'user': this.user,
            'product': this.product,
            'settings': this.settings,
            'products': this.params.get('products')
          };
          switch (userType) {
            case 1:
              // User Enabled 2019046436
              let serverData: Object = typeof (userStatus['data']) === 'object' && userStatus['data'] !== null ?
                (Object.keys(userStatus['data']).length > 0 ? userStatus['data'] : null) : null;
              if (serverData) {
                let replaceValues: Object = {
                  'date_start_formatted': 'fecha_comienzo_format',
                  'date_end_formatted': 'fecha_fin_format'
                };
                for (let key in serverData) {
                  let realKey: string = key in replaceValues ? replaceValues[key] : key;
                  paramOb['user'][realKey] = serverData[key];
                }
              }
              console.log(paramOb);
              this.userEnabled(paramOb);
              break;
            case 2:
              // User Activate
              this.activeUser(paramOb);
              break;
            default:
              // User not participating
              let alertNotAllow = this.alertCtrl.create({
                title: 'Ups!',
                subTitle: 'Su número telefónico no esta participando',
                buttons: ['OK']
              });
              alertNotAllow.present();
              break;
          }
        });
      });
    }
  }

  userEnabled(paramOb: Object): void {
    this.navCtrl.push(GiftContacts, paramOb);
  }

  activeUser(paramOb: Object): void {
    if (typeof (cordova) !== 'undefined') {
      // Estamos en el dispositivo
      this.nativeStorage.setItem('user', this.user).then((res) => {
        paramOb['user']['contacts'] = paramOb['contacts'];
        this.navCtrl.setRoot(GiftStatus, paramOb);
      }).catch((error) => {
        console.error(`[GiftContacts] [setData]`, error);
        let alert = this.alertCtrl.create({
          title: 'Ops!',
          subTitle: 'No se pudo guardar.',
          buttons: ['OK']
        });
        alert.present();
      });
    } else {
      this.navCtrl.setRoot(GiftStatus, paramOb);
    }
  }

  getImageURL(product: Object) {
    return this.platform.is('core') ?
      product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
  }

  valiteUser(): Promise<Object> {
    return new Promise((resolve) => {
      let body: Object = {
        'mobile': this.user['telefono']
      };
      this.http.post(this.settings['validate'], body).subscribe((data: Object) => {
        resolve(typeof (data) === 'object' && data !== null ? data : null);
      }, (error) => {
        console.error(`[GiftChoice] [valiteUser] POST ERROR `, error);
        resolve(null);
      }, () => {
        console.warn("[GiftChoice] [valiteUser] POST END");
      });
    });
  }

}