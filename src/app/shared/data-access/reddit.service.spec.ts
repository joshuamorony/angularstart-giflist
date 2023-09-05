import { TestBed } from '@angular/core/testing';
import { RedditService } from './reddit.service';

describe('RedditService', () => {
  let service: RedditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedditService],
    });

    service = TestBed.inject(RedditService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
