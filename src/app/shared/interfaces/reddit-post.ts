export interface RedditPost {
  data: RedditPostData;
}

interface RedditPostData {
  author: string;
  name: string;
  permalink: string;
  preview: RedditPreview;
  secure_media: RedditMedia;
  title: string;
  media: RedditMedia;
  url: string;
  thumbnail: string;
  num_comments: number;
}

interface RedditPreview {
  reddit_video_preview: RedditVideoPreview;
}

interface RedditVideoPreview {
  is_gif: boolean;
  fallback_url: string;
}

interface RedditMedia {
  reddit_video: RedditVideoPreview;
}
