import { Directive, HostListener, ElementRef, OnInit, Input } from "@angular/core";

@Directive({ selector: "[phoneFormatter]" })
export class phoneFormatter implements OnInit {

    inputElement: HTMLInputElement;
    el: HTMLInputElement;

    constructor(public elementRef: ElementRef) {
        this.el = this.elementRef.nativeElement;
    }

    ngAfterViewInit() {
        try {
            this.inputElement = <HTMLInputElement>this.el.children[0];
        } catch (error) {
        }
    }

    ngOnInit() {
    }

    @HostListener("blur", ["$event.target.value"])
    onBlur(value) {
        if (value) {
            let numParts: Array<number> = [3, 3, 3, 4];
            let partsFormats: Array<string> = ['(.)'];
            let parts: Array<string> = [];
            let counter: number = 0;
            let pre: number = 0;
            let values: Array<any> = value.split('');
            if (values.length > 0) {
                for (let key in numParts) {
                    let partNumber: number = numParts[key];
                    let partValues: Array<any> = [];
                    pre = counter;
                    counter += partNumber;
                    for (var _i = pre; _i < counter; _i++) {
                        if (values[_i]) {
                            partValues.push(values[_i]);
                        }
                    }
                    parts.push(partsFormats[key] ? partsFormats[key].replace(".", partValues.join("")) : partValues.join(""));
                }
            }
            this.inputElement.value = parts.join(" ");
        }
    }

}