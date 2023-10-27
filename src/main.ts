import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { AppComponent } from './app/app.component';
import { BookService } from './app/services/book/book.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { importProvidersFrom } from '@angular/core';
import { AppState } from './app/store/app.state';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), 
    importProvidersFrom(
        NgxsModule.forRoot([AppState], {
            developmentMode: true
        }),
        MatDialogModule,
        MatSnackBarModule,
    ),
    BookService, 
    provideRouter(ROUTES)],
});
