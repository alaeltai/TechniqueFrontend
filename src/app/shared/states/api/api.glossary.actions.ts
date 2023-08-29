export namespace APIGlossary {
    export class List {
        static readonly type = '[API Glossary] List';
    }

    export class Get {
        static readonly type = '[API Glossary] Get';
        constructor(public id: string) {}
    }
}
