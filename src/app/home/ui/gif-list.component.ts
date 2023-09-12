import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GifPlayerComponent } from './gif-player.component';
import { Gif } from 'src/app/shared/interfaces';
import { WINDOW } from 'src/app/shared/utils/injection-tokens';

@Component({
  standalone: true,
  selector: 'app-gif-list',
  template: `
    <ng-container *ngFor="let gif of gifs; trackBy: trackByFn">
      <app-gif-player
        [src]="gif.src"
        [thumbnail]="gif.thumbnail"
        data-testid="gif-list-item"
      ></app-gif-player>
      <mat-toolbar color="primary">
        <span>{{ gif.title }}</span>
        <span class="toolbar-spacer"></span>
        <button
          mat-icon-button
          (click)="window.open('https://reddit.com/' + gif.permalink)"
        >
          <mat-icon>comment</mat-icon>
        </button>
      </mat-toolbar>
    </ng-container>
  `,
  imports: [
    CommonModule,
    GifPlayerComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  styles: [
    `
      .toolbar-spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class GifListComponent {
  @Input({ required: true }) gifs!: Gif[];

  window = inject(WINDOW);

  trackByFn(_: number, gif: Gif) {
    return gif.permalink;
  }
}
