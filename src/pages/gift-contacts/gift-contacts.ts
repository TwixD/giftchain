import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavParams, NavController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions } from '@ionic-native/contacts';
import { NativeStorage } from '@ionic-native/native-storage';
import { FirebaseAppService } from '../../providers/firebase/firebase.service';
import { GiftStatus } from '../gift-status/gift-status';
import * as lodash from 'lodash';

@Component({
    selector: 'gift-contacts',
    templateUrl: 'gift-contacts.html'
})
export class GiftContacts {

    selectedContacts: Array<Object> = [];
    selectedContactsCounter: number = 0;
    contactList: Array<Object> = [];
    contactListOriginal: Array<Object> = [];
    loading: any;
    termOfSearch: string = '';
    maxContactsNumber: number = 15;
    user: Object = {};
    product: Object = {};

    constructor(public params: NavParams,
        public navCtrl: NavController,
        public contacts: Contacts,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public firebaseAppService: FirebaseAppService,
        public platform: Platform,
        public http: HttpClient,
        public nativeStorage: NativeStorage) {
        this.user = this.params.data.user || this.user;
        this.product = this.params.data.product || this.product;
    }

    ngOnInit() {
        this.selectedContactsCounter = this.maxContactsNumber;
        this.loadContacts();
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
                if (contact['displayName'].toUpperCase().includes(this.termOfSearch.toUpperCase())) {
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
                        this.selectedContacts.push(lodash.cloneDeep(contact));
                        this.selectedContactsCounter = this.selectedContactsCounter - 1;
                    } else {
                        contact['selected'] = false;
                    }
                    if (this.selectedContactsCounter <= 0) {
                        this.completeContacts();
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
            this.completeContacts();
        }
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

    completeContacts() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Contactos');
        alert.setSubTitle('Estos son los contactos seleccionados, quieres continuar?');
        for (let key in this.selectedContacts) {
            let selectedContact: Object = this.selectedContacts[key];
            alert.addInput({
                type: 'checkbox',
                label: `${selectedContact['displayName']} (${selectedContact['phone']})`,
                value: 'value1',
                checked: true
            });
        }

        alert.addButton('Cancelar');
        alert.addButton({
            text: 'Aceptar',
            handler: data => {
                this.setData();
            }
        });
        alert.present();
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
        this.user['contacts'] = contacts;
        this.user['product'] = this.product;
        this.user['id'] = this.user['id'] || this.firebaseAppService.getPushID();
        this.firebaseAppService.insert(`usuarios/${this.user['id']}`, this.user, false).then(() => {
            this.nativeStorage.setItem('user', this.user).then((res) => {
                this.alertServer().then(() => {
                    loader.dismiss().then(() => {
                        this.navCtrl.setRoot(GiftStatus, this.user);
                    });
                });
            }).catch((error) => {
                console.error(error);
                let alert = this.alertCtrl.create({
                    title: 'Ops!',
                    subTitle: 'No se pudo guardar.',
                    buttons: ['OK']
                });
                loader.dismiss().then(() => {
                    alert.present();
                });
            });
        }).catch(() => {
            let alert = this.alertCtrl.create({
                title: 'Ops!',
                subTitle: 'Nuestros servidores están ardiendo!, por favor intente mas tarde.',
                buttons: ['OK']
            });
            loader.dismiss().then(() => {
                alert.present();
            });
        });
    }

    alertServer(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                let settings: Object = 'settings' in this.params.data ?
                    this.params.data['settings'] : {};
                if ('url_alert' in settings) {
                    let body: Object = { id_usuario: this.user['id'] };
                    this.http.post(settings['url_alert'], body).subscribe(data => {
                        console.log(`[GiftContacts] [alertServer] POST SUCCESS`, data);
                        resolve(true);
                    }, (error) => {
                        console.error(`[GiftContacts] [alertServer] POST ERROR `, error);
                        resolve(false);
                    });
                } else {
                    console.error(`[GiftContacts] [alertServer] There is no configuration`);
                    resolve(false);
                }
            } catch (error) {
                console.error(`[GiftContacts] [alertServer]`, error);
                resolve(false);
            }
        });
    }

    prepareContacts(): Object {
        let contacts: Object = {};
        for (let key in this.contactList) {
            contacts[this.firebaseAppService.getPushID()] = this.contactList[key];
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

}