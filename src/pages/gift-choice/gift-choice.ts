import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { GiftContacts } from '../gift-contacts/gift-contacts';
import { GiftStatus } from '../gift-status/gift-status';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment-timezone';

@Component({
    selector: 'gift-choice',
    templateUrl: 'gift-choice.html'
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
            this.valiteUser().then((userStatus: any) => {
                loader.dismiss().then(() => {
                    let paramOb: Object = {
                        'user': this.user,
                        'product': this.product,
                        'settings': this.settings,
                        'products': this.params.get('products')
                    };
                    if (!isNaN(userStatus) && isFinite(userStatus)) {
                        if (userStatus == 1) {
                            this.navCtrl.push(GiftContacts, paramOb);
                        } else {
                            let alertNotAllow = this.alertCtrl.create({
                                title: 'Ups!',
                                subTitle: 'Su número telefónico no esta participando',
                                buttons: ['OK']
                            });
                            alertNotAllow.present();
                        }
                    } else {
                        this.nativeStorage.setItem('user', this.user).then((res) => {
                            paramOb['user']['contacts'] = 'contacts' in userStatus ?
                                userStatus['contacts'] : paramOb['contacts'];
                            this.navCtrl.setRoot(GiftStatus, paramOb);
                        }).catch((error) => {
                            console.error(`[GiftContacts] [setData]`, error);
                            let alert = this.alertCtrl.create({
                                title: 'Ops!',
                                subTitle: 'No se pudo guardar.',
                                buttons: ['OK']
                            });
                            loader.dismiss().then(() => {
                                alert.present();
                            });
                        });
                    }
                });
            });
        }

    }

    getImageURL(product: Object) {
        return this.platform.is('core') ?
            product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
    }

    valiteUser(): Promise<any> {
        return new Promise((resolve) => {
            let body: Object = { mobile: this.user['telefono'] };
            this.http.post(this.settings['validate'], body).subscribe((data: any) => {
                resolve(data || 0);
            }, (error) => {
                console.error(`[GiftChoice] [valiteUser] POST ERROR `, error);
                resolve(0);
            }, () => {
                console.warn("[GiftChoice] [valiteUser] POST END");
            });
        });
    }

}