import { EntityDataType } from '@teq/shared/types/types';

export namespace APIExport {
    export class PDF {
        static readonly type = '[API Export] PDF';
        constructor(public subtree: EntityDataType[]) {}
    }

    export class SVG {
        static readonly type = '[API Export] SVG';
        constructor(public subtree: EntityDataType[]) {}
    }
}
