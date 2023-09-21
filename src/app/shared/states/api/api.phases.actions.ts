export namespace APIPhases {
    export class List {
        static readonly type = '[API Phases] List';
    }

    export class Get {
        static readonly type = '[API Phases] Get';
        constructor(public id: string) {}
    }
}
