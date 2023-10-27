import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookForm } from './book.form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription, catchError, take } from 'rxjs';
import { AppActions } from 'src/app/store/actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent implements OnDestroy {
  private _subscription: Subscription;

  isLoading = false;
  bookForm = new BookForm();
  genres = [
    'Drama',
    'Crime',
    'Mystery',
    'Romance',
    'Thriller',
    'Comedy',
    'Documentary',
    'Fantasy',
    'Horror',
    'Musical',
    'Western',
    'Action',
    'Adventure',
    'Sci-Fi'
  ]

  constructor(
    private _dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number | 'new',
    private _router: Router, private _store: Store, private _snackBar: MatSnackBar
  ) {
    this._subscription = this._store.select(state => state.bookState.selectedBook).subscribe(book => this.bookForm.patchValue(book));
    this._subscription.add(
      _store.select(state => state.bookState.loadingSelected).subscribe(isLoading => this.isLoading = isLoading)
    );
    if(id != 'new') this._getBook(id)
  }

  private _getBook(id: number){
    this._store.dispatch(new AppActions.GetBook(id)).pipe(
      take(1),
      catchError(err => {
        this._snackBar.open(err, 'retry', {
          duration: 5000
        }).onAction().pipe(
          take(1)
        ).subscribe(_ => this._getBook(id));
        throw err;
      })
    ).subscribe();
  }

  save(){
    if(this.bookForm.invalid) return;
    this._store.dispatch(new AppActions.SaveBook(this.bookForm.value)).pipe(
      take(1),
      catchError(err =>{
        this._snackBar.open(err, 'X', {
          duration: 1500
        })
        throw err;
      })
    ).subscribe(_ => this.close());
  }

  close(){
    this._store.dispatch(new AppActions.UnSelectBook());
    this._dialogRef.close();
    this._router.navigate(['../'])
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
