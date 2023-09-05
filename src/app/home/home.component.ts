import { Component, inject } from '@angular/core';
import { GifListComponent } from './ui/gif-list.component';
import { RedditService } from '../shared/data-access/reddit.service';

@Component({
  standalone: true,
  selector: 'app-home',
  template: ` <app-gif-list [gifs]="redditService.gifs()" /> `,
  imports: [GifListComponent],
})
export default class HomeComponent {
  redditService = inject(RedditService);
}
