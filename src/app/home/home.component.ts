import { Component, inject } from '@angular/core';
import { GifListComponent } from './ui/gif-list.component';
import { RedditService } from '../shared/data-access/reddit.service';
import { SearchBarComponent } from './ui/search-bar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-search-bar
      [subredditFormControl]="redditService.subredditFormControl"
    ></app-search-bar>
    <app-gif-list
      *ngIf="!redditService.loading()"
      [gifs]="redditService.gifs()"
      class="grid-container"
    />
    <mat-progress-spinner
      *ngIf="redditService.loading()"
      mode="indeterminate"
      diameter="50"
    />
  `,
  imports: [
    GifListComponent,
    SearchBarComponent,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  styles: [
    `
      mat-progress-spinner {
        margin: 2rem auto;
      }
    `,
  ],
})
export default class HomeComponent {
  redditService = inject(RedditService);
}
