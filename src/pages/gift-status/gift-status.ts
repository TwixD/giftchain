import { Component } from '@angular/core';
import { NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';

@Component({
    selector: 'gift-status',
    templateUrl: 'gift-status.html'
})
export class GiftStatus {

    user: Object = {};
    product: Object = {};
    contacts: Array<Object> = [];

    constructor(public params: NavParams,
        public platform: Platform,
        public firebaseAppService: FirebaseAppService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController) {
    }

    ngOnInit() {
        this.user = this.params.data;
        this.product = this.user['product'];
        this.loadContacts();
    }

    loadContacts() {
        let loader = this.loadingCtrl.create({
            content: "Cargando invitados..."
        });
        loader.present();
        this.firebaseAppService.query(`/usuarios/${this.user['id']}/contacts`, 'selected', true).then((data) => {
            if (data) {
                this.contacts.length = 0;
                for (let key in data) {
                    let contact = Object.assign({}, data[key]);
                    this.contacts.push(contact);
                }
            }
            loader.dismiss();
        }).catch((error) => {
            loader.dismiss().then(() => {
                let alert = this.alertCtrl.create({
                    title: 'Ops!!',
                    subTitle: 'En el momento no puede cargar sus invitados, intente mas tarde',
                    buttons: ['OK']
                });
                alert.present();
            });
        });
    }

    getImageURL(product: Object) {
        return this.platform.is('core') ?
            product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
    }

    getClass(contact: Object): string {
        /*  
            Llamar   0  Rojo
            Visitado 1  Amarillo
            Agenda   2  Verde
        */
        return 'status' in contact ?
            (contact['status'] == 1 ? 'visited' :
                (contact['status'] == 2 ? 'diary' : 'call')) : 'call';
    }

}