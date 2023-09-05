import { RedditPost } from './reddit-post';

export interface RedditResponse {
  data: RedditResponseData;
}

interface RedditResponseData {
  children: RedditPost[];
}
