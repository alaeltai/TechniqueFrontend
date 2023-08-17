export namespace APITasks {
    export class List {
        static readonly type = '[API Tasks] List';
    }

    export class Get {
        static readonly type = '[API Tasks] Get';
        constructor(public id: string) {}
    }
}
