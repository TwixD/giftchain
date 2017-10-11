import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'gift-choice',
    templateUrl: 'gift-choice.html'
})
export class GiftChoice {

    product: Object;

    constructor(params: NavParams) {
        this.product = params.get('product');
    }

    ngOnInit() {
        console.log(this.product);
    }

}