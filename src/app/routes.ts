import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: 'books',
    loadComponent: () =>
      import('./pages/book-list/book-list.component').then(
        (comp) => comp.BookListComponent
      ),
  },
  {
    path: 'books/:id',
    loadComponent: () =>
      import('./pages/book-list/book-list.component').then(
        (comp) => comp.BookListComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'books',
  },
];
