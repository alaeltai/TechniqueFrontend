import { Pipe, PipeTransform } from '@angular/core';

let lastHint: string;

let lastRegExp: RegExp;

@Pipe({
    name: 'highlighter',
    standalone: true
})
export class HighlighterPipe implements PipeTransform {
    transform(value: string, args: string): unknown {
        if (!args) return value;

        const regExp = lastHint === args ? lastRegExp : new RegExp('(' + args + ')', 'igm');

        lastHint = args;

        lastRegExp = regExp;

        return value.replace(regExp, '<span class="highlighted-text">$1</span>');
    }
}
