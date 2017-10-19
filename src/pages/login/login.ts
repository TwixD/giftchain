import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Sim } from '@ionic-native/sim';
import { AlertController, NavController } from 'ionic-angular';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { GiftSlider } from '../gift-slider/gift-slider';

@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})
export class Login {

    phone: string;
    imageProp: string = 'imagen';
    products: Array<Object> = [];
    navParamsData: Object = {};

    constructor(public nativeStorage: NativeStorage,
        public sim: Sim,
        public firebaseAppService: FirebaseAppService,
        public alertCtrl: AlertController,
        public navCtrl: NavController) {            
    }

    ngOnInit() {
        this.loadSimInfo();
        this.loadProducts();
    }

    loadSimInfo() {
        this.sim.hasReadPermission().then((info) => {
            this.requestPermission(info).then((res) => {
                if (res) {
                    this.sim.getSimInfo().then(
                        (simInfo) => {
                            if (simInfo['phoneNumber']) {
                                this.phone = simInfo['phoneNumber'];
                            }
                        },
                        (err) => console.log('Unable to get sim info: ', err));
                }
            });
        }).catch((error) => {
            console.error(error);
        });
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
                            /*                            this.fileTransfer.download(fileURL, this.file.dataDirectory + fileName).then((entry) => {
                                                            console.log('download complete: ' + entry.toURL());
                                                        }, (error) => {
                                                            console.log(error);
                                                        });*/
                        });
                    }
                    this.products.push(product);
                }
            }
            this.navParamsData['products'] = this.products;
        });
    }

    requestPermission(hasPermission: boolean): Promise<boolean> {
        return new Promise((resolve) => {
            if (!hasPermission) {
                this.sim.requestReadPermission().then(
                    () => resolve(true),
                    () => resolve(false)
                );
            } else {
                resolve(hasPermission);
            }
        });
    }

    goTo(): void {
        if (this.phone) {
            this.firebaseAppService.query('/usuarios', 'telefono', this.phone).then((data) => {
                this.navParamsData['user'] = data.length > 0 ? data[0] : null;
                this.navCtrl.push(GiftSlider, this.navParamsData);
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

}
