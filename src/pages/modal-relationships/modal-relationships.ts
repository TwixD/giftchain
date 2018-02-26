import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalRelationshipsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-relationships',
  templateUrl: 'modal-relationships.html',
})
export class ModalRelationshipsPage {

  descriptionProperty: string = 'description';
  relationships: Array<Object> = [];
  contact: Object;
  objectKeys = Object.keys;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.relationships = navParams.get('relationships');
    this.contact = navParams.get('contact');
  }

  showDescRow(relation: Object): boolean {
    return this.descriptionProperty in relation ?
      (typeof (relation[this.descriptionProperty]) === 'object' && relation[this.descriptionProperty] !== null ?
        (Object.keys(relation[this.descriptionProperty]).length > 0 ? true : false) : false) : false;
  }

  getIndex(index: number): number {
    let newNumber = JSON.parse(JSON.stringify(index));
    return newNumber + 1;
  }

  selectRelation(relation: string): void {
    this.navParams.data['contact']['relationship'] = relation;
    this.navCtrl.pop();
  }

}
