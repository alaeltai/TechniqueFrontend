import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlighterPipe } from '@teq/shared/pipes/highlight.pipe';
import { LazyRequestDirective } from '@teq/shared/directives/lazy-request';

export interface IListItem {
    label: string;
    value: string;
}

@Component({
    selector: 'teq-side-list',
    standalone: true,
    imports: [CommonModule, HighlighterPipe, LazyRequestDirective],
    templateUrl: './side-list.component.html',
    styleUrls: ['./side-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideListComponent implements OnChanges {
    @Input() items: IListItem[] = [];

    @Input() value!: string;

    @Input() term!: string;

    @Input() lazyRequest?: boolean;

    @Input() requestFn?: CallableFunction;

    @Output() valueChange = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges): void {
        if ('items' in changes) {
            const items = changes['items'].currentValue as IListItem[];

            if (items) {
                // Validate the current selection is inside the new items list
                const included = items.some(i => i.value.toString() === this.value);

                if (!included) {
                    this._determineValue();
                }
            }
        }
    }

    change(item: IListItem): void {
        this.valueChange.emit(item.value.toString());
    }

    private _determineValue(): void {
        if (this.items.length) {
            this.value = this.value ?? this.items[0].value;
        }
    }
}
