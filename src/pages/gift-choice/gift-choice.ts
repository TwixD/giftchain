import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'gift-choice',
    templateUrl: 'gift-choice.html'
})
export class GiftChoice {

    constructor(params: NavParams) {
        console.log(params);
    }

}