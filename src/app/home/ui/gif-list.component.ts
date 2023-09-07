import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Gif } from 'src/app/shared/interfaces';

@Component({
  standalone: true,
  selector: 'app-gif-list',
  template: `
    <div
      *ngFor="let gif of gifs; trackBy: trackByFn"
      data-testid="gif-list-item"
    >
      <video
        playsinline
        poster="none"
        preload="none"
        [loop]="true"
        [muted]="true"
        [src]="gif.src"
      ></video>
    </div>
  `,
  imports: [CommonModule],
})
export class GifListComponent {
  @Input({ required: true }) gifs!: Gif[];

  trackByFn(_: number, gif: Gif) {
    return gif.permalink;
  }
}
