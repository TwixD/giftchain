import { Component } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import * as moment from 'moment-timezone';

@Component({
    selector: 'gift-choice',
    templateUrl: 'gift-choice.html'
})
export class GiftChoice {

    product: Object;
    user: Object = {
        'nombre': null,
        'telefono': null,
    };

    constructor(params: NavParams,
        public navCtrl: NavController,
        public alertCtrl: AlertController) {
        this.user = params.get('user') || this.user;
        this.product = params.get('product');
    }

    ngOnInit() {
        this.setDates();
    }

    setDates() {
        let utcMoment = moment().utc();
        this.user['fecha_comienzo'] = utcMoment.tz('America/New_York').format('YYYY-MM-DD');
        this.user['fecha_comienzo_format'] = utcMoment.tz('America/New_York').format('MMMM Do YYYY');
        this.user['fecha_fin'] = utcMoment.tz('America/New_York').add(14, 'd').format('YYYY-MM-DD');
        this.user['fecha_fin_format'] = utcMoment.tz('America/New_York').format('MMMM Do YYYY');
    }

    back() {
        this.navCtrl.pop();
    }

    accept() {
        let alert = this.alertCtrl.create({
            title: 'Comenzamos?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel'
                },
                {
                    text: 'Si',
                    handler: data => {
                        console.log(data);
                    }
                }
            ]
        });
        alert.present();
    }

}