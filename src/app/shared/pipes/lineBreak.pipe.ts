import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lineBreak',
    standalone: true
})
export class LineBreakPipe implements PipeTransform {
    transform(value: string | unknown[], args?: string): string {
        if (typeof value !== 'string') return '';
        if (!value) return value;

        const separator = args ?? '\n';

        const regExp = new RegExp(separator, 'igm');

        return value.replace(regExp, '<br/>');
    }
}
