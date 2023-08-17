import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITask } from '@teq/shared/types/task.type';

@Component({
    selector: 'teq-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
    @Input() task!: ITask;

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
