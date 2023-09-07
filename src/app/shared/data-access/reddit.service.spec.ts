import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RedditService } from './reddit.service';

describe('RedditService', () => {
  let service: RedditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RedditService],
    });

    service = TestBed.inject(RedditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('source: gifsLoaded$', () => {
    const mockPost = {
      data: {
        url: 'test.mp4',
        author: 'josh',
        name: 'whatever',
        permalink: 'link',
        title: 'title',
        thumbnail: 'thumb',
        num_comments: 5,
      },
    };

    const mockData = {
      data: {
        children: [mockPost, mockPost, mockPost],
      },
    };

    const parsedPost = {
      src: mockPost.data.url,
      author: mockPost.data.author,
      name: mockPost.data.name,
      permalink: mockPost.data.permalink,
      title: mockPost.data.title,
      thumbnail: mockPost.data.thumbnail,
      comments: mockPost.data.num_comments,
    };

    const expectedResults = [parsedPost, parsedPost, parsedPost] as any;

    it('should set gifs on initial load from gifs subreddit', () => {
      const request = httpMock.expectOne(
        'https://www.reddit.com/r/gifs/hot/.json?limit=100'
      );
      request.flush(mockData);

      expect(service.gifs()).toEqual(expectedResults);
    });

    // it('should set gifs from subreddit when control value changes', () => {});
    // it('should set error if request fails', () => {});
  });
});
