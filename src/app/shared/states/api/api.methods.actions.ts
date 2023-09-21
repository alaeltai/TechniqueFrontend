export namespace APIMethods {
    export class List {
        static readonly type = '[API Methods] List';
    }

    export class Get {
        static readonly type = '[API Methods] Get';
        constructor(public id: string) {}
    }
}
