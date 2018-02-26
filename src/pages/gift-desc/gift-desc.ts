import { Component } from '@angular/core';
import { NavParams, NavController, Platform } from 'ionic-angular';
import { GiftChoice } from '../gift-choice/gift-choice';

@Component({
  selector: 'gift-desc-page',
  templateUrl: 'gift-desc.html'
})
export class GiftDescPage {

  product: Object = {};
  settings: Object = {};

  constructor(public params: NavParams,
    public platform: Platform,
    public nav: NavController) {
    this.product = params.get('product');
    this.settings = params.get('settings');
  }

  getImageURL(product: Object) {
    return this.platform.is('core') ?
      product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
  }

  next(ev: string) {
    this.nav.push(GiftChoice, {
      'product': this.product,
      'settings': this.settings,
      'products': this.params.get('products')
    });
  }

  back() {
    this.nav.pop();
  }

  showArray(productLegend: any) {
    return productLegend instanceof Array ? true : false;
  }

  showBenefit(index: number) {
    return index in this.product['beneficios'] ? true : false;
  }

}