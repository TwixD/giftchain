import { Component, ViewChild } from '@angular/core';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Slides, AlertController, NavParams, NavController } from 'ionic-angular';
import {  GiftChoice } from '../gift-choice/gift-choice';

@Component({
    selector: 'gift-slider',
    templateUrl: 'gift-slider.html'
})
export class GiftSlider {

    @ViewChild(Slides) slides: Slides;
    products: Array<Object> = [];
    imageProp: string = 'imagen';
    fileTransfer: FileTransferObject;

    constructor(public navCtrl: NavController,
        public params: NavParams,
        public firebaseAppService: FirebaseAppService,
        public transfer: FileTransfer,
        public file: File,
        public alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.fileTransfer = this.transfer.create();
        this.loadProducts();
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
            console.log(this.products);
        });
    }

    eventHandler(event: Object) {
        switch (event['event']) {
            case 'next':
                this.slides.slideNext();
                break;
            case 'prev':
                this.slides.slidePrev();
                break;
            case 'selected':
                let alert = this.alertCtrl.create({
                    title: event['product']['nombre'],
                    subTitle: 'Desea seleccionar este articulo?',
                    buttons: [
                        {
                            text: 'No',
                            role: 'cancel'
                        },
                        {
                            text: 'Si',
                            handler: data => {
                                this.navCtrl.push( GiftChoice, event['product']);
                            }
                        }
                    ]
                });
                alert.present();
                break;
        }
    }

}
