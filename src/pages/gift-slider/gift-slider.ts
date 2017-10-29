import { Component, ViewChild } from '@angular/core';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Slides, AlertController, NavParams, NavController } from 'ionic-angular';
import { GiftChoice } from '../gift-choice/gift-choice';

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
        this.products = this.params.get('products');
    }

    ngOnInit() {
        this.fileTransfer = this.transfer.create();
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
                                this.params.data['product'] = event['product'];
                                this.navCtrl.push( GiftChoice, this.params.data);
                            }
                        }
                    ]
                });
                alert.present();
                break;
        }
    }

}
