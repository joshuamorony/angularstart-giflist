import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedditService } from './shared/data-access/reddit.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet></router-outlet> `,
  styles: [],
})
export class AppComponent {
  redditService = inject(RedditService);
  snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      const error = this.redditService.gifsLoaded.error();

      // if (error !== null) {
      //   this.snackBar.open(error, 'Dismiss', { duration: 2000 });
      // }
    });
  }
}
