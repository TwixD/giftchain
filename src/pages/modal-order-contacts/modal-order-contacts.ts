import { Component } from '@angular/core';
import { NavController, NavParams, reorderArray, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalOrderContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-modal-order-contacts',
  templateUrl: 'modal-order-contacts.html',
})
export class ModalOrderContactsPage {

  contacts: Array<Object> = [];

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.contacts = navParams.get('contacts');
  }

  getIndex(index: number): number {
    let newNumber = JSON.parse(JSON.stringify(index));
    return newNumber + 1;
  }

  reorderItems(indexes) {
    this.contacts = reorderArray(this.contacts, indexes);
  }

  ok() {
    this.viewCtrl.dismiss(this.contacts);
  }

}
