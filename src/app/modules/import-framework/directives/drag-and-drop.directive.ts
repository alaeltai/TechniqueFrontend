/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Directive, HostBinding, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
    file: File;
    url: SafeUrl;
}

@Directive({
    selector: '[teqDragAndDrop]'
})
export class DragAndDropDirective {
    @Output() file = new EventEmitter<FileHandle>();
    @Output() invalidFormat = new EventEmitter<boolean>();

    @HostBinding('style.background') private background = '#f5f5f5';

    constructor(private readonly _sanitizer: DomSanitizer, private readonly _el: ElementRef) {}

    @HostListener('dragover', ['$event']) public onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.togglePointerEvents('none');

        if (event.dataTransfer) {
            const file = event.dataTransfer.items[0];
            if (!file.type) {
                this.background = '#8fd40070';
            } else {
                this.background = '#f1293870';
            }
        }
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.togglePointerEvents('all');
        this.background = '#f5f5f5';
    }

    @HostListener('drop', ['$event']) public onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.togglePointerEvents('all');
        this.background = '#f5f5f5';

        if (event.dataTransfer) {
            const file = event.dataTransfer.files[0];
            const url = this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));

            if (file.name.includes('.teq')) {
                this.file.emit({
                    file,
                    url
                });
            } else {
                this.invalidFormat.emit(true);
            }
        }
    }

    togglePointerEvents(value: string): void {
        this._el.nativeElement.firstChild.style.pointerEvents = value;
    }
}
