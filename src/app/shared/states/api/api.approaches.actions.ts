export namespace APIApproaches {
    export class List {
        static readonly type = '[API Approaches] List';
    }

    export class Get {
        static readonly type = '[API Approaches] Get';
        constructor(public id: string) {}
    }
}
