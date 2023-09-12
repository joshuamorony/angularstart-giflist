import { Component, inject } from '@angular/core';
import { GifListComponent } from './ui/gif-list.component';
import { RedditService } from '../shared/data-access/reddit.service';
import { SearchBarComponent } from './ui/search-bar.component';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <app-search-bar
      [subredditFormControl]="redditService.subredditFormControl"
    ></app-search-bar>
    <app-gif-list [gifs]="redditService.gifs()" class="grid-container" />
  `,
  imports: [GifListComponent, SearchBarComponent],
})
export default class HomeComponent {
  redditService = inject(RedditService);
}
