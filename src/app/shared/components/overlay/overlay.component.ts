import { NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { SpinnerComponent } from '@teq/shared/components/spinner/spinner.component';
import { IOverlayDataContent, OverlayService, OverlayTemplate, OverlayType } from '@teq/shared/services/overlay.service';

import { ModalComponent } from '../modal/modal.component';
import { ITask } from '@teq/shared/types/task.type';
import { TaskDetailsComponent } from '@teq/shared/components/task-details/task-details.component';
import { FiltersService } from '@teq/shared/components/filters/filters.service';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
    selector: 'teq-overlay',
    standalone: true,
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.scss'],
    imports: [NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet, SpinnerComponent, ModalComponent, TaskDetailsComponent, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent {
    public OverlayTemplate = OverlayTemplate;
    public term = this._filtersService.term;

    @Input()
    @HostBinding('attr.data-active')
    active = true;

    @HostBinding('attr.data-type')
    get type(): string {
        return this.loading ? 'loading' : 'data';
    }

    get message(): string {
        let message = '';

        if (this.loading) {
            message = (this._overlayService.getOverlays(OverlayType.Loading)[0]?.extras?.message as string) ?? '';
        }
        return message;
    }

    get data(): IOverlayDataContent<unknown> {
        return this._overlayService.getOverlays(OverlayType.Data)[0]?.extras as IOverlayDataContent<unknown>;
    }

    get currentDataId(): number {
        return this._overlayService.getOverlays(OverlayType.Data)[0]?.registration;
    }

    get loading(): boolean {
        return !!(this.active && this._overlayService.getOverlays(OverlayType.Loading).length);
    }

    constructor(private readonly _overlayService: OverlayService, private readonly _filtersService: FiltersService) {}

    getTitle(task: ITask): string {
        return `${task.category.name
            .split(' ')
            .map(s => s.slice(0, 1))
            .join('')
            .toUpperCase()} - ${task.name}`;
    }
}
