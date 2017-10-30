import { Component, Input, Output, ElementRef, ViewChild, Renderer, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'slide-product',
    template: `
        <ion-slide no-margin>
            <img class="product-image" src="{{ getImageURL(product) }}" (click)="emit('selected')"/>
            <h1 class="product-name">{{ product['nombre'] }}</h1>
            <ion-grid no-margin no-padding>
                <ion-row no-margin no-padding>
                    <ion-col col-6 no-margin no-padding class="left-colum">
                        <ion-card no-margin no-padding class="sub-cards"  #characteristics>
                            <ion-card-header class="characteristics-header">
                                Características
                            </ion-card-header>
                            <ion-card-content class="characteristics-content">
                                <ion-scroll scrollY="true" style="width: 100%; height: 25vh">
                                    {{ product['caracteristicas'] }}
                                </ion-scroll>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col col-6 no-margin no-padding class="right-colum">
                        <ion-card no-margin no-padding class="sub-cards" #benefits>
                            <ion-card-header class="benefits-header">
                                Beneficios
                            </ion-card-header>
                            <ion-card-content class="benefits-content">
                                <ion-scroll scrollY="true" style="width: 100%; height: 25vh">
                                    {{ product['beneficios'] }}
                                </ion-scroll>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-fab left middle>
                <button ion-fab mini color="primary" (click)="emit('prev')">
                    <ion-icon name="arrow-round-back"></ion-icon>
                </button>
            </ion-fab>
            <ion-fab right middle>
                <button ion-fab mini color="primary" (click)="emit('next')">
                    <ion-icon name="arrow-round-forward"></ion-icon>
                </button>
            </ion-fab>
            <ion-fab top right>
                <button ion-fab mini color="primary" (click)="emit('selected')">
                    <img src="assets/img/appicon.png"/>
                </button>
            </ion-fab>
        </ion-slide>
    `,
    styles: [
        `
            ion-slide {
                align-items: flex-start !important;
                background-color: white;
                background-image: url('assets/img/bg.png');
                background-repeat: repeat;
            }
            .product-image{
                height: 50vh;
            }
            .product-name{
                font-size: 2.2rem;
                font-family: inherit;
                color: #2262A1;
            }
            .sub-cards{
                width: 100%;
                height: 35vh;
            }
            .characteristics-header{
                background-color: #f6c21b;
                color: white;
                font-weight: bold;
                font-size: 1.8rem;
            }
            .benefits-header{
                background-color: #ff8d00;
                color: white;
                font-weight: bold;
                font-size: 1.8rem;
            }
            .left-colum{
                padding-right: 3px !important;
            }
            .right-colum{
                padding-left: 3px !important;
            }
            .characteristics-content, .benefits-content{
                font-size: 1.2rem;
                padding: 8px;
                margin: 0px;
            }
        `
    ]
})
export class productSlide {

    @Input() product: Object;
    @Output() eventHandler = new EventEmitter();
    @ViewChild('characteristics') characteristicsElement: ElementRef;
    @ViewChild('benefits') benefitsElement: ElementRef;

    constructor(public renderer: Renderer,
        public platform: Platform) {
    }

    ngOnInit() {
    }

    emit(ev: string) {
        this.eventHandler.emit({ 'event': ev, 'product': this.product });
    }

    getImageURL(product: Object) {
        return this.platform.is('core') ?
            product['imgUrl'] : (product['imgUrlLocal'] || product['imgUrl']);
    }

}