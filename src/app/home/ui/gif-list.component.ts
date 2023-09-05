import { Component, Input } from '@angular/core';
import { Gif } from 'src/app/shared/interfaces';

@Component({
  standalone: true,
  selector: 'app-gif-list',
  template: ` <p>Hello world</p> `,
})
export class GifListComponent {
  @Input({ required: true }) gifs!: Gif[];
}
