import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { Column } from '../models/columns';
import { Action, State, StateContext } from '@ngxs/store';
import { AppActions } from './actions';
import { BookService } from '../services/book/book.service';
import { tap } from 'rxjs';

export interface AppStateModel {
  books?: Book[];
  selectedBook?: Book;
  loadingList: boolean;
  loadingSelected: boolean;
  error?: Error;
}

@State<AppStateModel>({
  name: 'bookState',
  defaults: {
    loadingList: false,
    loadingSelected: false,
  },
})
@Injectable()
export class AppState {
  constructor(private _bookService: BookService) {}

  @Action(AppActions.GetBooks)
  getBooks(ctx: StateContext<AppStateModel>) {
    ctx.patchState({loadingList: true});
    return this._bookService.getAll().pipe(
      tap((books) =>
        ctx.patchState({
          books,
          loadingList: false
        })
      )
    );
  }
  
  @Action(AppActions.GetBook)
  getBook(ctx: StateContext<AppStateModel>, action: AppActions.GetBook) {
    ctx.patchState({loadingSelected: true});
    return this._bookService.get(action.id).pipe(
      tap((selectedBook) => {
        ctx.patchState({
          selectedBook,
          loadingSelected: false
        })
      }
      )
    );
  }

  @Action(AppActions.SaveBook)
  saveBook(ctx: StateContext<AppStateModel>, action: AppActions.SaveBook) {
    ctx.patchState({loadingSelected: true});
    return this._bookService.save(action.book).pipe(
      tap((book) => {
        let books  = [...ctx.getState().books!];
        if (action.book.id) {
          const index = books?.findIndex((_book) => _book.id == book.id);
          books![index!] = book;
        } else {
          books?.push(book)
        }
        return ctx.patchState({
          books,
        });
      })
    );
  }
}
