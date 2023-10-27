import { Route, UrlMatcher, UrlSegment } from '@angular/router';

export function optionalIdParam(url: UrlSegment[]) {
  if(url.length === 1 && url[0]?.path == 'books')
    return {consumed: url};
  if(url.length === 2 && url[0]?.path == 'books')
    return {
      consumed: url,
      posParams: {
        id: url[1]
      }
    };
  return null;
}

export const ROUTES: Route[] = [
  {
    matcher: optionalIdParam,
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
