import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBreakPipe } from '@teq/shared/pipes/lineBreak.pipe';
import { ReplaceCharPipe } from '@teq/shared/pipes/replaceChar.pipe';
export interface ITab {
    title: string;
    content: string;
}

@Component({
    selector: 'teq-tabs',
    standalone: true,
    imports: [CommonModule, LineBreakPipe, ReplaceCharPipe],
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
    public selectedIndex = 0;

    @Input() tabs!: ITab[];

    changeTab(index: number): void {
        if (index !== this.selectedIndex) {
            this.selectedIndex = index;
        }
    }

    trackTabName(_i: number, tab: ITab): string {
        return tab.title;
    }
}
