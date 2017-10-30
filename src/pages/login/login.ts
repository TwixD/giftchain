import { Component } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController, NavController, LoadingController, Platform } from 'ionic-angular';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { GiftSlider } from '../gift-slider/gift-slider';
import { User } from '../../models/user.model';

@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})
export class Login {

    phone: string;
    imageProp: string = 'imagen';
    products: Array<Object> = [];
    navParamsData: Object = {};

    constructor(public firebaseAppService: FirebaseAppService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public transfer: FileTransfer,
        public platform: Platform,
        public keyboard: Keyboard,
        public file: File) {
    }

    ngOnInit() {
        this.loadProducts();
        this.getSettings();
    }

    getSettings() {
        this.firebaseAppService.query('/settings', null, null, true).then((data) => {
            this.navParamsData['settings'] = data;
        })
    }

    loadProducts() {
        this.firebaseAppService.query('/productos', 'habilitado', true).then((data) => {
            if (data) {
                for (let key in data) {
                    let product = Object.assign({}, data[key]);
                    if (this.imageProp in product) {
                        let fileName: string = product[this.imageProp];
                        this.firebaseAppService.getStorageFileUrl(fileName).then((fileURL) => {
                            product['imgUrl'] = fileURL;
                            this.loadProductImage(product);
                        });
                    }
                    this.products.push(product);
                }
            }
            this.navParamsData['products'] = this.products;
        });
    }

    loadProductImage(product: Object): Promise<boolean> {
        return new Promise((resolve) => {
            const fileTransfer: FileTransferObject = this.transfer.create();
            fileTransfer.download(product['imgUrl'], `${this.file.dataDirectory}${product['imagen']}`).then((entry) => {
                product['imgUrlLocal'] = entry.toURL();
            }, (error) => {
                console.error(error);
            });
        });
    }

    goTo(): void {
        if (this.phone) {
            let user: User = {
                'nombre': null,
                'telefono': this.phone,
                'email': null
            };
            let loader = this.loadingCtrl.create({
                content: "Cargando..."
            });
            let alertNotAllow = this.alertCtrl.create({
                title: 'Ups!',
                subTitle: 'Su número telefónico no esta participando',
                buttons: ['OK']
            });
            loader.present();
            this.firebaseAppService.query('/usuarios', 'telefono', this.phone).then((data) => {
                loader.dismiss().then(() => {
                    if (data.length > 0) {
                        this.navParamsData['user'] = data[0];
                        this.navCtrl.push(GiftSlider, this.navParamsData);
                    } else {
                        alertNotAllow.present();
                    }
                });
            }).catch(() => {
                loader.dismiss().then(() => {
                    alertNotAllow.present();
                });
            });
        } else {
            let alert = this.alertCtrl.create({
                title: 'Ups!',
                subTitle: 'Digita tu numero telefónico',
                buttons: ['OK']
            });
            alert.present();
        }
    }

    ionViewDidEnter() {
        this.platform.ready().then(() => {
            this.keyboard.disableScroll(true);
        });
    }

    ionViewWillLeave() {
        this.platform.ready().then(() => {
            this.keyboard.disableScroll(false);
        });
    }

}
