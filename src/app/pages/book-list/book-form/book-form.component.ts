import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Book } from 'src/app/models/book';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookForm } from './book.form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AppActions } from 'src/app/store/actions';
import { AppStateModel } from 'src/app/store/app.state';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  constructor(private _router: Router, private _store: Store) {
    this._subscription = this._store.select(state => state.bookState.selectedBook).subscribe(book => this.bookForm.patchValue(book));
    this._subscription.add(
      _store.select(state => state.bookState.loadingSelected).subscribe(isLoading => this.isLoading = isLoading)
    );
  }

  save(){
    if(this.bookForm.invalid) return;
    this._store.dispatch(new AppActions.SaveBook(this.bookForm.value));
  }

  close(){
    this._router.navigate(['../'])
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
