import { Injectable, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RedditService {
  // selectors
  gifs = computed(() => []);
}
