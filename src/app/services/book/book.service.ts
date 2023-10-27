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
      map(books => {
        if(Math.random() < 0.15) throw('There was an error getting the books.');
        return books; 
      })
    );
  }
  
  get(id: number): Observable<Book>{
    const book = this._books.find(book => book.id == id);
    if(book){
      return of({...book!}).pipe(delay(1000));
    }
    throw('Book Id was not found ')
  }

  save(book: Book): Observable<Book>{
    if(Math.random() < 0.15) return of(book).pipe(delay(1000), map(_ => {
      throw('There was an error saving the books.')
    }));
    if(book.id) {
      this._books[this._books.findIndex(_book => _book.id == book.id)] = book;
    } else {
      book.id = this._books[this._books.length -1].id + 1;
      this._books.push(book);
    }
    return of({...book}).pipe(delay(1000));
  }

  delete(id: number){
    if(Math.random() < 0.95) return of(id).pipe(delay(1000), map(_ => {
      throw('There was an error deleting the book.')
    }));
    this._books.splice(this._books.findIndex(book => book.id == id), 1);
    return of(id).pipe(delay(1000));
  }
}
