import { Book } from "../models/book";

export namespace AppActions {
    export class GetBooks {
        static readonly type = '[Books] Get Books';
    }
    export class GetBook {
        static readonly type = '[Books] Get Book';
        constructor(public id: number){}
    }
    export class SaveBook {
        static readonly type = '[Books] Save Books';
        constructor(public book: Book){}
    }
    export class DeleteBook {
        static readonly type = '[Books] Delete Books';
        constructor(public id: number){}
    }
    export class UnSelectBook {
        static readonly type = '[Books] UnSelect Book';
    }
}