import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'teq-side-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './side-list.component.html',
    styleUrls: ['./side-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideListComponent {
    public selectedItem: unknown;
    private _items: unknown[] = [];

    @Input() set items(value: unknown[]) {
        this._items = value;
    }

    get items(): unknown[] {
        return this._items;
    }
}
