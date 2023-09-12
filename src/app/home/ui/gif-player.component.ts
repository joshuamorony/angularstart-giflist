import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  computed,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';

interface GifPlayerState {
  playing: boolean;
  status: 'initial' | 'loading' | 'loaded';
}

@Component({
  standalone: true,
  selector: 'app-gif-player',
  template: `
    <mat-progress-spinner
      *ngIf="status() === 'loading'"
      mode="indeterminate"
      diameter="50"
    />
    <div
      [style.background]="'url(' + thumbnail + ') 50% 50% / cover no-repeat'"
      [ngStyle]="
        status() !== 'loaded'
          ? {
              filter: 'blur(10px) brightness(0.6)',
              transform: 'scale(1.1)'
            }
          : {}
      "
      class="preload-background"
    >
      <video
        (click)="togglePlay$.next()"
        #gifPlayer
        playsinline
        poster="none"
        preload="none"
        [loop]="true"
        [muted]="true"
        [src]="src"
      ></video>
    </div>
  `,
  styles: [
    `
      :host {
        position: relative;
      }

      .preload-background {
        width: 100%;
        height: auto;
      }

      video {
        width: 100%;
        height: auto;
        margin: auto;
        background: transparent;
      }

      mat-progress-spinner {
        position: absolute;
        top: 2em;
        right: 2em;
        z-index: 1;
      }
    `,
  ],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class GifPlayerComponent {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) thumbnail!: string;
  @ViewChild('gifPlayer') video!: ElementRef<HTMLVideoElement>;

  state = signal<GifPlayerState>({
    playing: false,
    status: 'initial',
  });

  //selectors
  playing = computed(() => this.state().playing);
  status = computed(() => this.state().status);

  // sources
  togglePlay$ = new Subject<void>();
  videoLoadStart$ = new Subject<void>();
  videoLoadComplete$ = new Subject<void>();

  constructor() {
    //reducers
    this.videoLoadStart$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'loading' }))
      );

    this.videoLoadComplete$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'loaded' }))
      );

    this.togglePlay$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, playing: !state.playing }))
      );

    // effects
    effect(
      () => {
        const video = this.video?.nativeElement;
        const playing = this.playing();
        const status = this.status();

        if (!video) return;

        if (status === 'initial') {
          video.addEventListener('loadeddata', () => {
            this.videoLoadComplete$.next();
          });

          this.videoLoadStart$.next();

          video.load();
        }

        if (status === 'loaded') {
          playing ? video.play() : video.pause();
        }
      },
      { allowSignalWrites: true }
    );
  }
}
