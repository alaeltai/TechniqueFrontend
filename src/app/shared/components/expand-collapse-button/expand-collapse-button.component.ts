import { Component, Input } from '@angular/core';

@Component({
    selector: 'teq-expand-collapse-button',
    standalone: true,
    templateUrl: './expand-collapse-button.component.html',
    styleUrls: ['./expand-collapse-button.component.scss']
})
export class ExpandCollapseButtonComponent {
    @Input() collapsed?: boolean;
}
