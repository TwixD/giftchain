import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavParams, NavController, AlertController, LoadingController, ModalController, Platform } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions } from '@ionic-native/contacts';
import { NativeStorage } from '@ionic-native/native-storage';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { GiftStatus } from '../gift-status/gift-status';
import * as lodash from 'lodash';
import { ModalRelationshipsPage } from '../modal-relationships/modal-relationships';
import { ModalOrderContactsPage } from '../modal-order-contacts/modal-order-contacts';

@Component({
  selector: 'gift-contacts',
  templateUrl: 'gift-contacts.html'
})
export class GiftContacts {

  maxContactsNumber: number = 15;
  minContactsNumber: number = 4;
  selectedContacts: Array<Object> = [];
  selectedContactsCounter: number = 0;
  contactList: Array<Object> = [];
  contactListOriginal: Array<Object> = [];
  loading: any;
  termOfSearch: string = '';
  user: Object = {};
  product: Object = {};
  settings: Object = {};
  header: Array<Object> = [];
  contactsRelationships: Array<Object> = [];

  constructor(public params: NavParams,
    public navCtrl: NavController,
    public contacts: Contacts,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public firebaseAppService: FirebaseAppService,
    public platform: Platform,
    public http: HttpClient,
    public modalCtrl: ModalController,
    public nativeStorage: NativeStorage) {
    this.user = this.params.data.user || this.user;
    this.product = this.params.data.product || this.product;
    this.settings = this.params.data.settings || this.settings;
  }

  ngOnInit() {
    this.setContactsMaxMin();
    this.setHeader();
    this.setContactsRelationships();
    this.loadContacts();
  }

  setContactsMaxMin(): void {
    let contactsMax: any = this.user['contacts_max'];
    let contactsMin: any = this.user['contacts_min'];
    this.maxContactsNumber = contactsMax ?
      (!isNaN(contactsMax) && isFinite(contactsMax) ?
        Number(contactsMax) : this.maxContactsNumber) : this.maxContactsNumber;
    this.minContactsNumber = contactsMin ?
      (!isNaN(contactsMin) && isFinite(contactsMin) ?
        Number(contactsMin) : this.minContactsNumber) : this.minContactsNumber;
    this.selectedContactsCounter = this.maxContactsNumber;
  }

  setContactsRelationships(): void {
    this.contactsRelationships = [
      {
        'value': 'familia',
        'label': 'Familia',
        'color': '#2262A1',
        'description': {
          'familia_padres': 'Padres',
          'familia_tios': 'Tíos',
          'familia_hermanos': 'Hermanos',
          'familia_primos': 'Primos',
          'familia_sobrinos': 'Sobrinos',
          'familia_consuegros': 'Consuegros',
          'familia_suegros': 'Suegros',
          'familia_concunas': 'Concuñas',
          'familia_cunados': 'Cuñados',
          'familia_compadres': 'Compadres',
          'familia_hijos': 'Hijos',
          'familia_ahijados': 'Ahijados'
        }
      },
      {
        'value': 'amigos',
        'label': 'Amigos',
        'color': '#FF6600',
        'description': {
          'amigos_amigos_del_trabajo': 'Amigos del trabajo',
          'amigos_amigos_de_iglesia': 'Amigos de iglesia',
          'amigos_padres_de_los_amigos_de_sus_hijos': 'Padres de los amigos de sus hijos',
          'amigos_vecinos_amigos': 'Vecinos-amigos',
          'amigos_amigos_de_escuela': 'Amigos de escuela'
        }
      }
    ];
  }

  setHeader(): void {
    this.header = [
      {
        'label': this.user['nombre'],
        'icon': 'contact'
      },
      {
        'label': `Inicio: ${this.user['fecha_comienzo_format']}`,
        'icon': 'time'
      },
      {
        'label': `Fin: ${this.user['fecha_fin_format']}`,
        'icon': 'time'
      }
    ];
  }

  getNumber(contact: Object) {
    let withoutNumber: string = 'Sin número';
    return contact['phoneNumbers'] ?
      (contact['phoneNumbers'].length > 0 ?
        contact['phoneNumbers'][0]['value'] : withoutNumber) : withoutNumber;
  }

  loadContacts() {
    try {
      this.presentLoadingDefault();
      let options = new ContactFindOptions();
      options.filter = "";
      let fields: any = ['*'];
      this.contacts.find(fields, options).then((res) => {
        for (let key in res) {
          let contact: Object = lodash.cloneDeep(res[key]['_objectInstance']);
          contact['selected'] = false;
          contact['phone'] = contact['phoneNumbers'] ?
            (contact['phoneNumbers'].length > 0 ?
              contact['phoneNumbers'][0]['value'] : null) : null;
          this.contactList.push(contact);
        }
        this.contactList.sort(this.compare);
        this.contactListOriginal = lodash.cloneDeep(this.contactList);
        this.loading.dismiss();
      }).catch((err) => {
        console.log(err);
        this.loading.dismiss();
      });
    } catch (error) {
      console.error(`[GiftContacts] [loadContacts] An error ocurred`, error);
    }
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando contactos...'
    });
    this.loading.present();
  }

  onInput($event: any) {
    this.contactList.length = 0;
    if (this.termOfSearch) {
      let contactListCopy: Array<Object> = lodash.cloneDeep(this.contactListOriginal);
      for (let key in contactListCopy) {
        let contact: Object = lodash.cloneDeep(contactListCopy[key]);
        if (contact['displayName'] ?
          contact['displayName'].toUpperCase().includes(this.termOfSearch.toUpperCase()) : false) {
          for (let key2 in this.selectedContacts) {
            if (this.selectedContacts[key2]['id'] == contact['id']) {
              contact = lodash.cloneDeep(this.selectedContacts[key2]);
              break;
            }
          }
          this.contactList.push(lodash.cloneDeep(contact));
        }
      }
    } else {
      this.onCancel(null);
    }
  }

  onCancel($event: any) {
    let originalCopy = lodash.cloneDeep(this.contactListOriginal);
    for (let key in this.selectedContacts) {
      for (let key2 in originalCopy) {
        if (this.selectedContacts[key]['id'] == originalCopy[key2]['id']) {
          originalCopy[key2] = lodash.cloneDeep(this.selectedContacts[key]);
        }
      }
    }
    this.contactList = originalCopy;
  }

  tapEvent(contact: Object) {
    if (this.selectedContactsCounter > 0 || contact['selected']) {
      contact['selected'] = !contact['selected'];
      if (contact['selected']) {
        this.checkPhone(contact).then(() => {
          if (contact['phone']) {
            let cloneContact: Object = lodash.cloneDeep(contact);
            this.selectedContacts.push(cloneContact);
            this.selectedContactsCounter = this.selectedContactsCounter - 1;
            this.setRelationship(cloneContact).then(() => {
              contact['relationship'] = cloneContact['relationship'];
              if (this.selectedContactsCounter <= 0) {
                this.reorderContacts();
              }
            });
          } else {
            contact['selected'] = false;
          }
        });
      } else {
        this.selectedContactsCounter = this.selectedContactsCounter + 1;
        for (let key in this.selectedContacts) {
          let selectedContact: Object = this.selectedContacts[key];
          if (selectedContact['id'] == contact['id']) {
            this.selectedContacts.splice(Number(key), 1);
            break;
          }
        }
      }
    }
    if (this.selectedContactsCounter <= 0) {
      this.reorderContacts();
    }
  }

  setRelationship(contact: Object): Promise<boolean> {
    return new Promise((resolve) => {
      let modal = this.modalCtrl.create(ModalRelationshipsPage, {
        'relationships': this.contactsRelationships,
        'contact': contact
      }, {
          'showBackdrop': false,
          'enableBackdropDismiss': false
        });
      modal.present();
      modal.onDidDismiss((data) => {
        resolve(true);
      });
    });
  }

  checkPhone(contact: Object): Promise<boolean> {
    return new Promise((resolve) => {
      if (contact['phone']) {
        resolve(true);
      } else {
        this.changePhone(contact).then((res) => {
          resolve(res);
        });
      }
    });
  }

  reorderContacts(): void {
    let modal = this.modalCtrl.create(ModalOrderContactsPage, {
      'contacts': this.selectedContacts
    }, {
        'showBackdrop': false,
        'enableBackdropDismiss': false
      });
    modal.present();
    modal.onDidDismiss((data) => {
      for (let key in this.selectedContacts) {
        // Asignamos el orden al contacto seleccionado
        this.selectedContacts[key]['order'] = key;
      }
      this.setData();
    });
  }

  changePhone(contact: Object): Promise<boolean> {
    return new Promise((resolve) => {
      let prompt = this.alertCtrl.create({
        title: 'Teléfono',
        message: "Cambiar número teléfonico",
        inputs: [
          {
            name: 'phone',
            placeholder: 'Teléfono',
            type: 'number',
            value: contact['phone']
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              resolve(false);
            }
          },
          {
            text: 'Ok',
            handler: data => {
              contact['phone'] = data['phone'] || null;
              resolve(true);
            }
          }
        ]
      });
      prompt.present();
    });
  }

  setData() {
    let loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    loader.present();
    let contacts: Object = this.prepareContacts();
    this.user['name'] = this.user['nombre'];
    this.user['mobile'] = this.user['telefono'];
    this.user['contacts'] = contacts;
    this.user['product'] = this.product['id'] || null;
    this.save().then((res) => {
      loader.dismiss().then(() => {
        if (res) {
          this.nativeStorage.setItem('user', this.user).then((res) => {
            this.navCtrl.setRoot(GiftStatus, {
              'settings': this.settings,
              'user': this.user,
              'products': this.params.get('products')
            });
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
        } else {
          let alert = this.alertCtrl.create({
            title: 'Ops!',
            subTitle: 'Nuestros servidores están ardiendo!, por favor intente mas tarde.',
            buttons: ['OK']
          });
          alert.present();
        }
      });
    });
  }

  save(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        let body: Object = this.user;
        this.http.post(this.settings['save'], body).subscribe((data) => {
          console.log(`[GiftContacts] [save] POST SUCCESS`, data);
          resolve(true);
        }, (error) => {
          console.error(`[GiftContacts] [save] POST ERROR `, error);
          resolve(false);
        });
      } catch (error) {
        console.error(`[GiftContacts] [save]`, error);
        resolve(false);
      }
    });
  }

  prepareContacts(): Array<Object> {
    let contacts: Array<Object> = [];
    let selectedContactsID: Object = {};
    for (let key in this.selectedContacts) {
      let contact: Object = this.selectedContacts[key];
      selectedContactsID[contact['id']] = contact;
    }
    for (let key in this.contactList) {
      let contact: Object = this.contactList[key];
      if (contact['phone'] && contact['displayName']) {
        contact = selectedContactsID[contact['id']] || contact;
        contacts.push(contact);
      }
    }
    return contacts;
  }

  compare(a: Object, b: Object) {
    if (a['displayName'] < b['displayName'])
      return -1;
    if (a['displayName'] > b['displayName'])
      return 1;
    return 0;
  }

  getImageURL(product: Object) {
    return this.platform.is('core') ?
      product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
  }

  showContinueButton(): boolean {
    return (this.maxContactsNumber - this.selectedContactsCounter) >= this.minContactsNumber ? true : false;
  }

  continueWithoutMaximum(): void {
    let alert = this.alertCtrl.create({
      title: 'Continuar',
      subTitle: `Desea continuar con ${this.maxContactsNumber - this.selectedContactsCounter} contactos?`,
      buttons: [
        {
          text: 'NO',
          role: 'cancel'
        },
        {
          text: 'CONTINUAR',
          handler: data => {
            this.reorderContacts();
          }
        }
      ]
    });
    alert.present();
  }

  getRelationship(contact: Object): string {
    let relName: string = null;
    if (contact['relationship']) {
      for (let key in this.contactsRelationships) {
        let relation: Object = this.contactsRelationships[key];
        if (typeof (relation['description']) === 'object' && relation['description'] !== null ?
          (contact['relationship'] in relation['description'] ? true : false) : false) {
          relName = relation['description'][contact['relationship']];
          break;
        }
      }
    }
    return relName;
  }

}