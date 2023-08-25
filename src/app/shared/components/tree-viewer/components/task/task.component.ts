import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { OverlayComponent } from '@teq/shared/components/overlay/overlay.component';
import { ITask } from '@teq/shared/types/task.type';
import { OverlayService, OverlayTemplate, OverlayType } from '../../../../services/overlay.service';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';

@Component({
    selector: 'teq-task',
    standalone: true,
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    imports: [NgIf, NgFor, LabelComponent, OverlayComponent, HighlighterPipe]
})
export class TaskComponent {
    @Input() task!: ITask;
    @Input() disabled?: boolean;
    @Input() term!: string;

    @HostListener('click', [])
    onClick(): void {
        console.log('task activated', this.task.id);
        this._overlayService.add(OverlayType.Data, { template: OverlayTemplate.TaskDetails, data: this.task });
    }

    @HostBinding('attr.data-disabled')
    get disabledHost(): boolean {
        return this.disabled ?? this.task.disabled ?? false;
    }

    constructor(private readonly _overlayService: OverlayService) {}

    get category(): string {
        return (this.task.category.name ?? '')
            .split(' ')
            .map(s => s.slice(0, 1))
            .join('')
            .toUpperCase();
    }

    get responsible(): string {
        return (this.task.responsible.name ?? '')
            .replace(/[()[\]]/g, '')
            .split(' ')
            .map(s => s.slice(0, 1))
            .join('')
            .toUpperCase();
    }

    get artefacts(): string {
        return this.task.artefacts.map(a => a.name).join('; ');
    }
}
