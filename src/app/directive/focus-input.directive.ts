import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Inject,
    OnChanges,
    Renderer2,
    ChangeDetectorRef
    } from '@angular/core';
import { element } from 'protractor';


@Directive({
    selector: '[focused]',
})
export class FocusInputDirective {
    @Input() focused: boolean;


    constructor(
        @Inject(ElementRef) private element: ElementRef,
        private renderer: Renderer2,
        private changeDetectorRef: ChangeDetectorRef
    ) {}


    protected ngOnChanges() {
        if (this.focused) {
            this.element.nativeElement.focus();
            // this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
            this.changeDetectorRef.detectChanges();
        }
    }
}
