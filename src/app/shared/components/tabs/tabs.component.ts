import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBreakPipe } from '@teq/shared/pipes/lineBreak.pipe';
import { ReplaceCharPipe } from '@teq/shared/pipes/replaceChar.pipe';
import { TypeofPipe } from '@teq/shared/pipes/typeof.pipe';
import { ITableData, ITableHeader, TableComponent } from '../table/table.component';
export interface ITab {
    title: string;
    content?: string;
    contentTable?: ITableData;
}

@Component({
    selector: 'teq-tabs',
    standalone: true,
    imports: [CommonModule, LineBreakPipe, ReplaceCharPipe, TypeofPipe, TableComponent],
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnChanges {
    public selectedIndex = 0;
    public animateContent = true;

    @Input() tabs!: ITab[];

    @Input() item: unknown;

    @Input() tableHeaders!: ITableHeader[];

    ngOnChanges(changes: SimpleChanges): void {
        changes['item']?.currentValue !== changes['item']?.previousValue && this.toggleContentAnimation();
    }

    changeTab(index: number): void {
        if (index !== this.selectedIndex) {
            this.selectedIndex = index;
            this.toggleContentAnimation();
        }
    }

    trackTabName(_i: number, tab: ITab): string {
        return tab.title;
    }

    toggleContentAnimation(): void {
        this.animateContent = false;
        setTimeout(() => {
            this.animateContent = true;
        });
    }
}
