import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule],
  template: `
  <div class="flex flex-col h-full">
      <mat-toolbar color="primary">
          <img src="../../../assets/logo.png" alt="QuillHub Logo" class="h-1/2 object-cover">
      </mat-toolbar>
      <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {}
