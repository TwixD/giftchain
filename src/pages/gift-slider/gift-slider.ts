import { Component } from '@angular/core';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Component({
    selector: 'gift-slider',
    templateUrl: 'gift-slider.html'
})
export class GiftSlider {

    products: Array<Object> = [];
    imageProp: string = 'imagen';
    fileTransfer: FileTransferObject;

    constructor(public firebaseAppService: FirebaseAppService,
        public transfer: FileTransfer,
        public file: File) {
    }

    ngOnInit() {
        this.fileTransfer = this.transfer.create();
        this.loadProducts();
    }

    loadProducts() {
        this.firebaseAppService.query('/productos', 'habilitado', true).then((data) => {
            if (data) {
                for (let key in data) {
                    if (this.imageProp in data[key]) {
                        let fileName: string = data[key][this.imageProp];
                        this.firebaseAppService.getStorageFileUrl(fileName).then((fileURL) => {
                            this.fileTransfer.download(fileURL, this.file.dataDirectory + fileName).then((entry) => {
                                console.log('download complete: ' + entry.toURL());
                            }, (error) => {
                                console.log(error);
                            });
                            console.log(fileURL);
                        });
                    }
                }
                this.products = data;
            }
        });
    }


}
