import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'teq-search',
    standalone: true,
    imports: [NgFor, NgIf],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
    @Input() searchText?: string;
}
