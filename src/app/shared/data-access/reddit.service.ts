import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Gif, RedditPost, RedditResponse } from '../interfaces';
import { FormControl } from '@angular/forms';
import {
  EMPTY,
  Subject,
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  expand,
  map,
  startWith,
  switchMap,
} from 'rxjs';

export interface GifsState {
  gifs: Gif[];
  error: string | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class RedditService {
  http = inject(HttpClient);

  subredditFormControl = new FormControl();
  gifsPerPage = 20;

  // state
  state = signal<GifsState>({
    gifs: [],
    error: null,
    loading: true,
  });

  // selectors
  gifs = computed(() => this.state().gifs);
  error = computed(() => this.state().error);
  loading = computed(() => this.state().loading);

  //sources
  error$ = new Subject<string | null>();
  pagination$ = new Subject<void>();

  subredditChanged$ = this.subredditFormControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('gifs')
  );

  gifsLoaded$ = this.subredditChanged$.pipe(
    switchMap((subreddit) =>
      this.pagination$.pipe(
        startWith(undefined),
        concatMap(() => {
          const currentGifs = this.gifs();
          const fetchAfterGif = currentGifs.length
            ? currentGifs[currentGifs.length - 1].name
            : null;

          return this.fetchFromReddit(
            subreddit,
            fetchAfterGif,
            this.gifsPerPage
          ).pipe(
            // A single request might not give us enough valid gifs for a
            // full page, as not every post is a valid gif
            // Keep fetching more data until we do have enough for a page
            expand((response, index) => {
              const { gifs, gifsRequired } = response;
              const remainingGifsToFetch = gifsRequired - gifs.length;
              const maxAttempts = 15;

              const newFetchAfterGif = gifs.length
                ? gifs[gifs.length - 1].name
                : null;

              const shouldKeepTrying =
                remainingGifsToFetch > 0 &&
                index < maxAttempts &&
                newFetchAfterGif !== null;

              return shouldKeepTrying
                ? this.fetchFromReddit(
                    subreddit,
                    newFetchAfterGif,
                    remainingGifsToFetch
                  )
                : EMPTY;
            })
          );
        })
      )
    )
  );

  constructor() {
    //reducers
    this.subredditChanged$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({ ...state, loading: true, gifs: [] }));
    });

    this.gifsLoaded$.pipe(takeUntilDestroyed()).subscribe((response) =>
      this.state.update((state) => ({
        ...state,
        gifs: [...state.gifs, ...response.gifs],
        loading: false,
      }))
    );

    this.error$.pipe(takeUntilDestroyed()).subscribe((error) =>
      this.state.update((state) => ({
        ...state,
        error,
      }))
    );
  }

  private fetchFromReddit(
    subreddit: string,
    after: string | null,
    gifsRequired: number
  ) {
    return this.http
      .get<RedditResponse>(
        `https://www.reddit.com/r/${subreddit}/hot/.json?limit=50` +
          (after ? `&after=${after}` : '')
      )
      .pipe(
        catchError((err) => {
          this.handleError(err);
          return EMPTY;
        }),
        map((response) => ({
          gifs: this.convertRedditPostsToGifs(response.data.children),
          gifsRequired,
        }))
      );
  }

  private handleError(err: HttpErrorResponse) {
    // Handle specific error cases
    if (err.status === 404 && err.url) {
      this.error$.next(`Failed to load gifs for /r/${err.url.split('/')[4]}`);
      return;
    }

    // Generic error if no cases match
    this.error$.next(err.statusText);
  }

  private convertRedditPostsToGifs(posts: RedditPost[]) {
    return posts
      .map((post) => ({
        src: this.getBestSrcForGif(post),
        author: post.data.author,
        name: post.data.name,
        permalink: post.data.permalink,
        title: post.data.title,
        thumbnail: post.data.thumbnail,
        comments: post.data.num_comments,
      }))
      .filter((post): post is Gif => post.src !== null);
  }

  private getBestSrcForGif(post: RedditPost) {
    // If the source is in .mp4 format, leave unchanged
    if (post.data.url.indexOf('.mp4') > -1) {
      return post.data.url;
    }

    // If the source is in .gifv or .webm formats, convert to .mp4 and return
    if (post.data.url.indexOf('.gifv') > -1) {
      return post.data.url.replace('.gifv', '.mp4');
    }

    if (post.data.url.indexOf('.webm') > -1) {
      return post.data.url.replace('.webm', '.mp4');
    }

    // If the URL is not .gifv or .webm, check if media or secure media is available
    if (post.data.secure_media?.reddit_video) {
      return post.data.secure_media.reddit_video.fallback_url;
    }

    if (post.data.media?.reddit_video) {
      return post.data.media.reddit_video.fallback_url;
    }

    // If media objects are not available, check if a preview is available
    if (post.data.preview?.reddit_video_preview) {
      return post.data.preview.reddit_video_preview.fallback_url;
    }

    // No useable formats available
    return null;
  }
}
