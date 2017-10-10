import { Component, Input, Output, ElementRef, ViewChild, Renderer, EventEmitter } from '@angular/core';

@Component({
    selector: 'slide-product',
    template: `
        <ion-slide no-margin>
            <img class="product-image" src="{{ product['imgUrl'] }}" (click)="emit('selected')"/>
            <h1 class="product-name">{{ product['nombre'] }}</h1>
            <ion-grid no-margin no-padding>
                <ion-row no-margin no-padding>
                    <ion-col col-6 no-margin no-padding class="left-colum">
                        <ion-card no-margin no-padding class="sub-cards"  #characteristics>
                            <ion-card-header class="characteristics-header">
                                Características
                            </ion-card-header>
                            <ion-card-content class="characteristics-content">
                                {{ product['caracteristicas'] }}
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                    <ion-col col-6 no-margin no-padding class="right-colum">
                        <ion-card no-margin no-padding class="sub-cards" #benefits>
                            <ion-card-header class="benefits-header">
                                Beneficios
                            </ion-card-header>
                            <ion-card-content class="benefits-content">
                                {{ product['beneficios'] }}
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-fab left bottom>
                <button ion-fab color="primary" (click)="emit('prev')"><ion-icon name="arrow-round-back"></ion-icon></button>
            </ion-fab>
            <ion-fab right bottom>
                <button ion-fab color="primary" (click)="emit('next')"><ion-icon name="arrow-round-forward"></ion-icon></button>
            </ion-fab>
        </ion-slide>
    `,
    styles: [
        `
            ion-slide {
                align-items: flex-start !important;
                background-color: white;
            }
            .product-image{
                height: 50vh;
            }
            .product-name{
                font-size: 5rem;
            }
            .sub-cards{
                width: 100%;
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
        `
    ]
})
export class productSlide {

    @Input() product: Object;
    @Output() eventHandler = new EventEmitter();
    @ViewChild('characteristics') characteristicsElement: ElementRef;
    @ViewChild('benefits') benefitsElement: ElementRef;

    constructor(public renderer: Renderer) {
    }

    ngOnInit() {
        console.log(this.product);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            let maxHeight: number = Math.max(this.characteristicsElement.nativeElement.offsetHeight,
                this.benefitsElement.nativeElement.offsetHeight);
            this.characteristicsElement.nativeElement.style.height = maxHeight + 'px';
            this.benefitsElement.nativeElement.style.height = maxHeight + 'px';
            this.renderer.setElementStyle(this.characteristicsElement.nativeElement, 'background-color', 'rgba(246, 194, 27, .1)');
            this.renderer.setElementStyle(this.benefitsElement.nativeElement, 'background-color', 'rgba(255, 141, 0, .1)');
        }, 600);
    }

    emit(ev: string) {
        this.eventHandler.emit({ 'event': ev, 'product': this.product });
    }

}