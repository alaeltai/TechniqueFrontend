import { ISVGRenderingOptions } from '@teq/shared/types/svg.type';

export namespace FrameworkSVGRenderer {
    export class Change {
        static readonly type = '[Framework SVGRenderer] Changed';
        constructor(public options: ISVGRenderingOptions) {}
    }
}
