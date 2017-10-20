import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions } from '@ionic-native/contacts';

@Component({
    selector: 'gift-contacts',
    templateUrl: 'gift-contacts.html'
})
export class GiftContacts {

    contactList: Array<Object> = [];
    contactListOriginal: Array<Object> = [];
    loading: any;
    termOfSearch: string = '';

    constructor(public params: NavParams,
        public navCtrl: NavController,
        public contacts: Contacts,
        public loadingCtrl: LoadingController) {
    }

    ngOnInit() {
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
                    let contact: Object = Object.assign({}, res[key]['_objectInstance']);
                    contact['selected'] = false;
                    this.contactList.push(contact);
                    this.contactListOriginal.push(Object.assign({}, contact));
                }
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
        if (this.termOfSearch) {
            this.contactList.length = 0;
            for (let key in this.contactListOriginal) {
                let contact: Object = this.contactListOriginal[key];
                if (contact['displayName'].includes(this.termOfSearch)) {
                    this.contactList.push(Object.assign({}, contact));
                }
            }
        } else {
            this.contactList = Object.assign([], this.contactListOriginal);
        }
    }

    onCancel($event: any) {
        this.contactList = Object.assign([], this.contactListOriginal);
    }

    tapEvent(contact:Object){
        contact['selected'] = !contact['selected'];
    }

}