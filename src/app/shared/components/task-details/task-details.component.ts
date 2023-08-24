import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LandingPageModule } from '@teq/modules/landing-page/landing-page.module';
import { LabelComponent } from '@teq/shared/components/label/label.component';
import { ITask } from '@teq/shared/types/task.type';
import { CollapsibleComponent } from '../collapsible-component/collapsible/collapsible.component';

@Component({
    selector: 'teq-task-details',
    standalone: true,
    templateUrl: './task-details.component.html',
    imports: [NgIf, NgFor, LabelComponent, LandingPageModule, CommonModule, CollapsibleComponent],
    styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent {
    @Input() task!: ITask;

    get inputArtefacts() {
        return this.task.artefacts.filter(art => art.type === 'input');
    }

    get outputArtefacts() {
        return this.task.artefacts.filter(art => art.type === 'output');
    }
}
