import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-gif-player',
  template: `
    <video
      playsinline
      poster="none"
      preload="none"
      [loop]="true"
      [muted]="true"
    ></video>
  `,
})
export class GifPlayerComponent {
  @Input({ required: true }) src!: string;
}
