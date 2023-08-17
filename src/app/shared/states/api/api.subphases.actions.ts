export namespace APISubPhases {
    export class List {
        static readonly type = '[API SubPhases] List';
    }

    export class Get {
        static readonly type = '[API SubPhases] Get';
        constructor(public id: string) {}
    }
}
