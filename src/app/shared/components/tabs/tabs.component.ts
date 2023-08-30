import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBreakPipe } from '@teq/shared/pipes/lineBreak.pipe';
import { ReplaceCharPipe } from '@teq/shared/pipes/replaceChar.pipe';
import { fadeIn } from '@teq/shared/animations/animations.lib';

export interface ITab {
    title: string;
    content: string;
}

@Component({
    selector: 'teq-tabs',
    standalone: true,
    imports: [CommonModule, LineBreakPipe, ReplaceCharPipe],
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    animations: [fadeIn]
})
export class TabsComponent {
    public selectedIndex = 0;

    @Input() tabs!: ITab[];

    changeTab(index: number): void {
        this.selectedIndex = index;
    }
}
