import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { Book, BookColumns } from 'src/app/models/book';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngxs/store';
import { AppActions } from 'src/app/store/actions';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Subscription,
  catchError,
  combineLatest,
  debounceTime,
  take,
  tap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Column } from 'src/app/models/columns';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from './book-form/book-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent implements AfterViewInit, OnDestroy {
  private _subscription: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cols = [...BookColumns, {
    label: 'Actions',
    property: '-',
    show: true
  }];

  searchCtrl = new FormControl('');
  dataSource: MatTableDataSource<Book> = new MatTableDataSource([] as Book[]);
  lastSearch = '';
  isLoading = false;

  get colsDef(): string[] {
    return this.cols.reduce((acu: string[], col) => {
      if (col.show) acu.push(col.property);
      return acu;
    }, []);
  }

  constructor(private _store: Store, private _cdr: ChangeDetectorRef, private _dialog: MatDialog, private _route: ActivatedRoute, private _router: Router, private _snackBar: MatSnackBar) {
    this._subscription = combineLatest([
      this._store.select(state => state.bookState.loadingList).pipe(
        tap(isLoading => this.isLoading = isLoading)
      ),
      this._store.select((state) => state.bookState.books).pipe(
        tap(books => this.dataSource.data = books ?? ([] as Book[]))
      ),
      this.searchCtrl.valueChanges.pipe(
        debounceTime(500),
        tap(val => {
          this.lastSearch = (val ?? '');
          this.dataSource.filter = this.lastSearch.trim().toLowerCase()
        })
      ),
      this._route.params.pipe(
        tap(params => {
          if(params['id']) {
            let id = params['id'];
            if(Number.parseInt(id) || id === 'new') {
              this._dialog.open(BookFormComponent, {
                width: '600px',
                data: id
              });
            } else {
              this._router.navigate(['../'])
            } 
          }
        })
      )
    ]).subscribe(_ => this._cdr.markForCheck());
    this._getBooks();
  }

  private _getBooks(){
    this._store.dispatch(new AppActions.GetBooks()).pipe(
      take(1),
      catchError(err => {
        this._snackBar.open(err, 'retry', {
          duration: 5000
        }).onAction().pipe(
          take(1)
        ).subscribe(_ => this._getBooks());
        throw err;
      })
    ).subscribe();
  }

  openBook(id?: number){
    this._router.navigate([`${id??'new'}`], {relativeTo: this._route});
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleCol(colum: Column) {
    colum.show = !colum.show;
    this._cdr.markForCheck();
  }

  deleteBook(id: number){
    this._store.dispatch(new AppActions.DeleteBook(id));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
