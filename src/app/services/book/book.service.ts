import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { BOOKS_DATA } from 'src/data/book';


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private _books: Book[] = BOOKS_DATA;
  
  getAll(): Observable<Book[]>{
    return of([...this._books]).pipe(
      delay(1000),
      // map(_ => {throw('There was an error getting the books.')})
    );
  }
  
  get(id: number): Observable<Book>{
    const book = this._books.find(book => book.id == id);
    if(!book) throw new Error(`No book found with id: ${id}`);
    return of({...book}).pipe(delay(1000));
  }

  save(book: Book): Observable<Book>{
    if(book.id) {
      this._books[this._books.findIndex(_book => _book.id == book.id)] = book;
    } else {
      book.id = this._books[this._books.length -1].id + 1;
      this._books.push(book);
    }
    return of({...book}).pipe(delay(1000));
  }

  delete(id: number){
    this._books.splice(this._books.findIndex(book => book.id == id), 1);
    return of();
  }
}
