import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-gif-player',
  template: ` <p>Hello world</p> `,
})
export class GifPlayerComponent {
  @Input({ required: true }) src!: string;
}
