import { Component, inject } from '@angular/core';
import { GifListComponent } from './ui/gif-list.component';
import { RedditService } from '../shared/data-access/reddit.service';
import { SearchBarComponent } from './ui/search-bar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
      infiniteScroll
      (scrolled)="redditService.pagination$.next()"
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
    InfiniteScrollModule,
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
