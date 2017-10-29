import { Component } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Sim } from '@ionic-native/sim';
import { AlertController, NavController, LoadingController } from 'ionic-angular';
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

    constructor(public sim: Sim,
        public firebaseAppService: FirebaseAppService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public transfer: FileTransfer,
        public file: File) {
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
            let user: User = {
                'nombre': null,
                'telefono': this.phone,
                'email': null
            };
            let loader = this.loadingCtrl.create({
                content: "Cargando..."
            });
            loader.present();
            this.firebaseAppService.query('/usuarios', 'telefono', this.phone).then((data) => {
                loader.dismiss().then(() => {
                    this.navParamsData['user'] = data.length > 0 ? data[0] : user;
                    this.navCtrl.push(GiftSlider, this.navParamsData);
                });
            }).catch(() => {
                loader.dismiss().then(() => {
                    this.navParamsData['user'] = user;
                    this.navCtrl.push(GiftSlider, this.navParamsData);
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

}
