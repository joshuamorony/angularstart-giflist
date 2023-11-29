import { Component, inject } from '@angular/core';
import { GifListComponent } from './ui/gif-list.component';
import { SearchBarComponent } from './ui/search-bar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RedditServiceRxAngular } from '../shared/data-access/reddit.service-rxa';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-search-bar
      [subredditFormControl]="redditService.subredditFormControl"
    />

    @if (redditService.loading()){
    <mat-progress-spinner mode="indeterminate" diameter="50" />
    } @else {
    <app-gif-list
      [gifs]="redditService.gifs()"
      infiniteScroll
      (scrolled)="
        redditService.actions.pagination(redditService.lastKnownGif())
      "
      class="grid-container"
    />
    }
  `,
  imports: [
    GifListComponent,
    SearchBarComponent,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
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
  redditService = inject(RedditServiceRxAngular);
}
