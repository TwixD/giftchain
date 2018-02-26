import { Component } from '@angular/core';
import { NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'gift-status',
  templateUrl: 'gift-status.html'
})
export class GiftStatus {

  user: Object = {};
  product: Object = {};
  contacts: Array<Object> = [];
  products: Array<Object> = [];
  settings: Object = {};

  constructor(public params: NavParams,
    public platform: Platform,
    public firebaseAppService: FirebaseAppService,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public alertCtrl: AlertController) {
    this.settings = this.params.get('settings');
    this.user = this.params.get('user');
  }

  ngOnInit() {
    this.user = this.params.get('user');
    this.settings = this.params.get('settings');
    this.products = this.params.get('products');
    this.loadContacts();
    this.setProduct();
  }

  setProduct() {
    for (let key in this.products) {
      if (this.products[key]['id'] == this.user['product']) {
        this.product = this.products[key];
        break;
      }
    }
  }

  loadContacts() {
    let loader = this.loadingCtrl.create({
      content: "Cargando invitados..."
    });
    loader.present();
    let body: Object = {
      'mobile': this.user['telefono']
    };
    this.http.post(this.settings['read'], body).subscribe((data: any) => {
      this.contacts = typeof (data) == 'object' && data !== null ?
        ('contacts' in data ? data['contacts'] : []) : [];
      loader.dismiss();
    }, (error) => {
      console.error(`[GiftStatus] [loadContacts] POST ERROR `, error);
      loader.dismiss().then(() => {
        let alert = this.alertCtrl.create({
          title: 'Ops!!',
          subTitle: 'En el momento no puede cargar sus invitados, intente mas tarde',
          buttons: ['OK']
        });
        alert.present();
      });
    }, () => {
      console.warn("[GiftStatus] [loadContacts] POST END");
    });
  }

  call(contact: Object): void {
    let alert = this.alertCtrl.create({
      title: contact['displayName'],
      subTitle: `Llamar al número <br><span><b>${contact['phone']}</b></span>`,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
        },
        {
          text: 'SI',
          handler: () => {
            window.location.href = `tel: ${contact['phone']}`;
          }
        }
      ]
    });
    alert.present();
  }

  getImageURL(product: Object) {
    return this.platform.is('core') ?
      product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
  }

  getClass(contact: Object): string {
    /* Llamar   0  Rojo
       Visitado 1  Amarillo
       Agenda   2  Verde
    */
    return 'estado' in contact ?
      (contact['estado'] == 1 ? 'visited' :
        (contact['estado'] == 2 ? 'diary' : 'call')) : 'call';
  }

}