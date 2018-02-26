import { Component } from '@angular/core';
import { NavParams, NavController, Platform } from 'ionic-angular';
import { GiftDescPage } from '../gift-desc/gift-desc';

@Component({
  selector: 'welcome-page',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  imageArray: Array<string> = [null, null, null, null];
  products: Array<Object> = [];
  settings: Object = {};

  constructor(public params: NavParams,
    public nav: NavController,
    public platform: Platform) {
    this.products = params.get('products');
    this.settings = params.get('settings');
  }

  getImageURL(product: Object) {
    return this.platform.is('core') ?
      product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
  }

  showCard(cardNumber: number) {
    return this.products[cardNumber] !== void 0 ?
      (this.products[cardNumber] || false) : false
  }

  selectProduct(product: Object) {
    this.nav.push( GiftDescPage, {
      'product': product,
      'settings': this.settings,
      'products': this.products
    });
  }

}