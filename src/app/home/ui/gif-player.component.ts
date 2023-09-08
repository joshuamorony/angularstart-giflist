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
import { Subject, tap } from 'rxjs';

interface GifPlayerState {
  playing: boolean;
  status: 'initial' | 'loading' | 'loaded';
}

@Component({
  standalone: true,
  selector: 'app-gif-player',
  template: `
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
  `,
})
export class GifPlayerComponent {
  @Input({ required: true }) src!: string;
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
  // stream from loadeddata event listener

  constructor() {
    //reducers
    this.togglePlay$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, playing: !state.playing }))
      );

    effect(() => {
      const video = this.video?.nativeElement;
      const playing = this.playing();

      if (!video) return;

      playing ? video.play() : video.pause();
    });
  }
}
