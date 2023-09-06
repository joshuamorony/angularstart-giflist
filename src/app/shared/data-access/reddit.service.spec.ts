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
    const mockData = [{}, {}, {}] as any;

    it('should set gifs on initial load from gifs subreddit', () => {
      const request = httpMock.expectOne('/r/gifs/hot/.json');
      request.flush(mockData);

      expect(service.gifs()).toEqual(mockData);
    });

    // it('should set gifs from subreddit when control value changes', () => {});
    // it('should set error if request fails', () => {});
  });
});
