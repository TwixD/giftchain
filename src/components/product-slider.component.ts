import { Component, Input } from '@angular/core';

@Component({
    selector: 'slide-product',
    template: `
        <ion-slide no-margin>
            <img class="product-image" src="{{ product['imgUrl'] }}"/>
            <span class="product-name">{{ product['nombre'] }}</span>
            <ion-grid no-margin no-padding>
                <ion-row no-margin no-padding>
                    <ion-col col-6 no-margin no-padding>
                        <ion-card no-margin no-padding class="sub-cards">
                            <ion-card-header class="characteristics">
                                Características
                            </ion-card-header>
                            <ion-card-content>
                                The British use the term "header", but the American term "head-shot" the English simply refuse to adopt.
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col col-6 no-margin no-padding>
                        <ion-card no-margin no-padding class="sub-cards">
                            <ion-card-header>
                                Beneficios
                            </ion-card-header>
                            <ion-card-content>
                                The British use the term "header", but the American term "head-shot" the English simply refuse to adopt.
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-slide>
    `,
    styles: [
        `
            ion-slide {
                align-items: flex-start !important;
            }
            .product-image{
                height: 50vh;
            }
            .product-name{
                font-size: 8rem;
            }
            .sub-cards{
                width: 100%;
            }
            .characteristics{
                background-color: #ffe221;
                color: white;
                font-weight: bold;
            }
        `
    ]
})
export class productSlide {

    @Input()
    product: Object;

    constructor() {

    }

    ngOnInit() {
        console.log(this.product);
    }

}