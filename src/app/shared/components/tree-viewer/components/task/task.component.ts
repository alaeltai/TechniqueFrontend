import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, WritableSignal, signal } from '@angular/core';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { OverlayComponent } from '@teq/shared/components/overlay/overlay.component';
import { ITask } from '@teq/shared/types/task.type';

@Component({
    selector: 'teq-task',
    standalone: true,
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    imports: [NgIf, NgFor, LabelComponent, OverlayComponent]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
    @Input() task!: ITask;

    private readonly _modal: WritableSignal<boolean> = signal(false);

    @HostListener('click', [])
    onClick(): void {
        console.log('task activated', this.task.id);
        this._modal.set(true);
    }

    get modal(): WritableSignal<boolean> {
        return this._modal;
    }

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
