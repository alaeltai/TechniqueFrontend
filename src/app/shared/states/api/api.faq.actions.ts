export namespace APIFaq {
    export class List {
        static readonly type = '[API Faq] List';
    }

    export class Get {
        static readonly type = '[API Faq] Get';
        constructor(public id: string) {}
    }
}
