import { Component } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions } from '@ionic-native/contacts';

@Component({
    selector: 'gift-contacts',
    templateUrl: 'gift-contacts.html'
})
export class GiftContacts {

    contactList: Array<Object> = [];

    constructor(public params: NavParams,
        public navCtrl: NavController,
        public contacts: Contacts) {
    }

    ngOnInit() {
        console.log(this.params);
        console.log(this.contacts);

        let options = new ContactFindOptions();
        options.filter = "";
        let fields: any = ['*'];

        this.contacts.find(fields, options).then((res) => {
            for (let key in res) {
                let contact: Object = Object.assign({}, res[key]);
                contact['selected'] = false;
                this.contactList.push();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    getNumber(contact: Object) {
        let withoutNumber: string = 'Sin número';
        return contact['phoneNumbers'] ?
            (contact['phoneNumbers'].length > 0 ?
                contact['phoneNumbers'][0]['value'] : withoutNumber) : withoutNumber;
    }

}