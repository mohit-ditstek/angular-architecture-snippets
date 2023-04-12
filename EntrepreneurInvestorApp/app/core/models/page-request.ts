export class PageRequest {
    pageNumber: number = 1;
    pageSize: number = 10;
}

export class SortPageRequest {
    pageNumber: number = 1;
    pageSize: number = 10;
    sortBy: string = null;
    sortOrder: string = "ASC"
}