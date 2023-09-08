import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GifPlayerComponent } from './gif-player.component';
import { Gif } from 'src/app/shared/interfaces';

@Component({
  standalone: true,
  selector: 'app-gif-list',
  template: `
    <app-gif-player
      *ngFor="let gif of gifs; trackBy: trackByFn"
      data-testid="gif-list-item"
      src=""
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
