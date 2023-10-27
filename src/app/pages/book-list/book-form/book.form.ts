import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Book } from "src/app/models/book";


export class BookForm extends FormGroup {
    readonly id = this.get('id') as FormControl;
    readonly title = this.get('title') as FormControl;
    readonly author = this.get('author') as FormControl;
    readonly isbn = this.get('isbn') as FormControl;
    readonly genre = this.get('genre') as FormControl;
    readonly stock = this.get('stock') as FormControl;

    constructor(book?: Partial<Book>){
        super({
            id: new FormControl(book?.id),
            title: new FormControl(book?.title, Validators.required),
            author: new FormControl(book?.author, Validators.required),
            isbn: new FormControl(book?.isbn, [Validators.required, Validators.pattern('[0-9Xx]{9}-[0-9Xx]')]),
            genre: new FormControl(book?.genre, Validators.required),
            stock: new FormControl(book?.stock, Validators.required),
        });
    }
}