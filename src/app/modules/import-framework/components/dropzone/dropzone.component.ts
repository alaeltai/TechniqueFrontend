import { Component, Output, EventEmitter } from '@angular/core';
import { FileHandle } from '@teq/modules/import-framework/directives/drag-and-drop.directive';

@Component({
    selector: 'teq-dropzone',
    templateUrl: './dropzone.component.html',
    styleUrls: ['./dropzone.component.scss']
})
export class DropZoneComponent {
    public invalidFormat = false;

    @Output() file = new EventEmitter<File>();

    onDrop(event: FileHandle): void {
        this.invalidFormat = false;

        this.file.emit(event.file);
    }

    onFileSelected(ev: Event): void {
        this.invalidFormat = false;

        const file = (ev.target as HTMLInputElement).files?.[0];

        if (file) {
            if (!file.name.includes('teq')) {
                this.invalidFormat = true;
                return;
            }

            this.file.emit(file);
        }
    }
}
