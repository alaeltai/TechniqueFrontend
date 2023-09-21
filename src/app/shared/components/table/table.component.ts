/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '@teq/shared/components/icon/icon.component';

export interface ITableHeader {
    name: string;
    sortDirection?: string;
}

export interface ITableData {
    rows: any[];
}

type SortDirection = 'ascending' | 'descending' | 'unsorted';

@Component({
    selector: 'teq-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, IconComponent, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
    @Input() tableHeaders!: ITableHeader[];
    @Input() data!: ITableData;
    @Input() sort?: boolean;

    sortColumn(index: number): void {
        this.data.rows.sort((a, b) => {
            const direction = this.getSortDirection(index);

            if (direction === 'unsorted' || direction === 'descending') {
                this.setColumnDirection(index, 'ascending');
                return a[index].name.localeCompare(b[index].name);
            } else {
                this.setColumnDirection(index, 'descending');
                return b[index].name.localeCompare(a[index].name);
            }
        });
    }

    setColumnDirection(index: number, direction: string): void {
        this.tableHeaders.forEach((h, i) => {
            if (index === i) {
                this.tableHeaders[i].sortDirection = direction;
                return;
            }
            this.tableHeaders[i].sortDirection = 'unsorted';
        });
    }

    getSortDirection(index: number): SortDirection {
        const arr = this.data.rows;
        const c = [];

        for (let i = 1; i < arr.length; i++) {
            c.push(arr[i - 1][index].name.localeCompare(arr[i][index]?.name));
        }

        if (c.every(n => n <= 0)) return 'ascending';
        if (c.every(n => n >= 0)) return 'descending';

        return 'unsorted';
    }
}
