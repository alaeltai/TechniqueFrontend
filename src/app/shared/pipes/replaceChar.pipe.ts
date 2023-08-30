import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceChar',
    standalone: true
})
export class ReplaceCharPipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        if (!value) return value;

        const regExp = new RegExp(args[0], 'igm');

        return value.replace(regExp, args[1]);
    }
}
