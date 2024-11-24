import { Injectable, inject, linkedSignal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Gif, RedditPost, RedditResponse } from '../interfaces';
import { FormControl } from '@angular/forms';
import {
  EMPTY,
  debounceTime,
  distinctUntilChanged,
  expand,
  map,
  reduce,
  startWith,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RedditService {
  private http = inject(HttpClient);
  private gifsPerPage = 5;

  subredditFormControl = new FormControl();

  //sources
  private subredditChanged$ = this.subredditFormControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('gifs'),
    map((subreddit) => (subreddit.length ? subreddit : 'gifs')),
  );
  subreddit = toSignal(this.subredditChanged$);

  paginateAfter = linkedSignal({
    source: this.subreddit,
    computation: () => null as string | null,
  });

  gifsLoaded = rxResource({
    request: () => ({
      subreddit: this.subreddit(),
      paginateAfter: this.paginateAfter(),
    }),
    loader: ({ request }) =>
      this.fetchRecursivelyFromReddit(request.subreddit, request.paginateAfter),
  });

  gifs = linkedSignal<ReturnType<typeof this.gifsLoaded.value>, Gif[]>({
    source: this.gifsLoaded.value,
    computation: (source, prev) => {
      // initial and page loads
      if (typeof source === 'undefined') return prev?.value ?? [];

      // clear on subreddit change
      if (
        !prev ||
        !prev.value[0]?.permalink.startsWith(`/r/${source.subreddit}`)
      )
        return source.gifs;

      // accumulate values on paginate
      return [...prev.value, ...source.gifs];
    },
  });

  private fetchFromReddit(
    subreddit: string,
    after: string | null,
    gifsRequired: number,
  ) {
    return this.http
      .get<RedditResponse>(
        `https://www.reddit.com/r/${subreddit}/hot/.json?limit=100` +
          (after ? `&after=${after}` : ''),
      )
      .pipe(
        map((response) => {
          const posts = response.data.children;
          let gifs = this.convertRedditPostsToGifs(posts);
          let paginateAfter = posts.length
            ? posts[posts.length - 1].data.name
            : null;

          return {
            gifs,
            gifsRequired,
            paginateAfter,
            subreddit,
          };
        }),
      );
  }

  private fetchRecursivelyFromReddit(
    subreddit: string,
    paginateAfter: string | null,
  ) {
    return this.fetchFromReddit(
      subreddit,
      paginateAfter,
      this.gifsPerPage,
    ).pipe(
      // A single request might not give us enough valid gifs for a
      // full page, as not every post is a valid gif
      // Keep fetching more data until we do have enough for a page
      expand((response, index) => {
        const { gifs, gifsRequired, paginateAfter } = response;
        const remainingGifsToFetch = gifsRequired - gifs.length;
        const maxAttempts = 5;

        const shouldKeepTrying =
          remainingGifsToFetch > 0 &&
          index < maxAttempts &&
          paginateAfter !== null;

        return shouldKeepTrying
          ? this.fetchFromReddit(subreddit, paginateAfter, remainingGifsToFetch)
          : EMPTY;
      }),
      map((response) => {
        const { gifs, gifsRequired } = response;
        const remainingGifsToFetch = gifsRequired - gifs.length;

        if (remainingGifsToFetch < 0) {
          // trim to page size
          const trimmedGifs = response.gifs.slice(0, remainingGifsToFetch);
          return {
            ...response,
            gifs: trimmedGifs,
            paginateAfter: trimmedGifs[trimmedGifs.length - 1].name,
          };
        }

        return response;
      }),
      reduce(
        (acc, curr) => ({
          ...curr,
          gifs: [...acc.gifs, ...curr.gifs],
        }),
        {
          gifs: [] as Gif[],
          paginateAfter: null as string | null,
          gifsRequired: this.gifsPerPage,
          subreddit: 'gifs',
        },
      ),
    );
  }

  private convertRedditPostsToGifs(posts: RedditPost[]) {
    const defaultThumbnails = ['default', 'none', 'nsfw'];

    return posts
      .map((post) => {
        const thumbnail = post.data.thumbnail;
        const modifiedThumbnail = defaultThumbnails.includes(thumbnail)
          ? `/assets/${thumbnail}.png`
          : thumbnail;

        const validThumbnail =
          modifiedThumbnail.endsWith('.jpg') ||
          modifiedThumbnail.endsWith('.png');

        return {
          src: this.getBestSrcForGif(post),
          author: post.data.author,
          name: post.data.name,
          permalink: post.data.permalink,
          title: post.data.title,
          thumbnail: validThumbnail ? modifiedThumbnail : `/assets/default.png`,
          comments: post.data.num_comments,
        };
      })
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
