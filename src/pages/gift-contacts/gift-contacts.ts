import { Component } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions } from '@ionic-native/contacts';

@Component({
    selector: 'gift-contacts',
    templateUrl: 'gift-contacts.html'
})
export class GiftContacts {

    constructor(public params: NavParams,
        public navCtrl: NavController,
        public contacts: Contacts) {
    }

    ngOnInit() {
        console.log(this.params);
        console.log(this.contacts);

        // let findC: Contact = this.contacts.find();


        let options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        options.desiredFields = ['*'];
        options.hasPhoneNumber = true;
        let fields: any = ['*'];
        this.contacts.find(fields, options).then((res) => {
            for(let key in res){
                console.log(res[key]);
            }
        }).catch((err) => {
            console.log(err);
        });


    }

}