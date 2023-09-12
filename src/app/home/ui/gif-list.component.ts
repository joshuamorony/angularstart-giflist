import { CommonModule } from '@angular/common';
import { Component, InjectionToken, Input } from '@angular/core';
import { GifPlayerComponent } from './gif-player.component';
import { Gif } from 'src/app/shared/interfaces';

export const WINDOW = new InjectionToken<Window>('The window object', {
  factory: () => window,
});

@Component({
  standalone: true,
  selector: 'app-gif-list',
  template: `
    <app-gif-player
      *ngFor="let gif of gifs; trackBy: trackByFn"
      [src]="gif.src"
      [thumbnail]="gif.thumbnail"
      data-testid="gif-list-item"
    ></app-gif-player>
  `,
  imports: [CommonModule, GifPlayerComponent],
})
export class GifListComponent {
  @Input({ required: true }) gifs!: Gif[];

  trackByFn(_: number, gif: Gif) {
    return gif.permalink;
  }
}
