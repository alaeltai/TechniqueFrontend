import type { IPagination } from '@teq/shared/types/pagination.type';

export namespace FrameworkPagination {
    export class Change {
        static readonly type = '[Framework Pagination] Changed';
        constructor(public pagination: IPagination) {}
    }
}
