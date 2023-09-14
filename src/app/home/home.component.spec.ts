import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { RedditService } from '../shared/data-access/reddit.service';
import { DebugElement, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GifListComponent } from './ui/gif-list.component';
import { MockGifListComponent } from './ui/gif-list.component.spec';
import { SearchBarComponent } from './ui/search-bar.component';
import { MockSearchBarComponent } from './ui/search-bar.component.spec';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let redditService: RedditService;

  const testGifs = [{}, {}, {}];
  const testControl = {};

  const mockLoadingSignal = signal(true);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: RedditService,
          useValue: {
            gifs: jest.fn().mockReturnValue(testGifs),
            loading: mockLoadingSignal,
            subredditFormControl: testControl,
            pagination$: {
              next: jest.fn(),
            },
          },
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [GifListComponent, SearchBarComponent] },
        add: { imports: [MockGifListComponent, MockSearchBarComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    redditService = TestBed.inject(RedditService);
    mockLoadingSignal.set(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('app-search-bar', () => {
    let searchBar: DebugElement;

    beforeEach(() => {
      searchBar = fixture.debugElement.query(By.css('app-search-bar'));
    });

    describe('input: subredditFormControl', () => {
      it('should supply the subredditFormControl from reddit service', () => {
        expect(searchBar.componentInstance.subredditFormControl).toEqual(
          testControl
        );
      });
    });
  });

  describe('app-gif-list', () => {
    let gifList: DebugElement;

    beforeEach(() => {
      mockLoadingSignal.set(false);
      fixture.detectChanges();
      gifList = fixture.debugElement.query(By.css('app-gif-list'));
    });

    describe('output: scrolled', () => {
      it('should next the pagination$ source', () => {
        gifList.triggerEventHandler('scrolled', null);
        expect(redditService.pagination$.next).toHaveBeenCalled();
      });
    });

    describe('input: gifs', () => {
      it('should supply the gifs selector from the reddit service', () => {
        expect(gifList.componentInstance.gifs).toEqual(testGifs);
      });

      it('should display spinner instead of app-gif-list if loading state is true', () => {
        mockLoadingSignal.set(true);
        fixture.detectChanges();

        const spinnerBefore = fixture.debugElement.query(
          By.css('mat-progress-spinner')
        );
        const gifListBefore = fixture.debugElement.query(
          By.css('app-gif-list')
        );

        expect(gifListBefore).toBeFalsy();
        expect(spinnerBefore).toBeTruthy();

        mockLoadingSignal.set(false);
        fixture.detectChanges();

        const spinnerAfter = fixture.debugElement.query(
          By.css('mat-progress-spinner')
        );
        const gifListAfter = fixture.debugElement.query(By.css('app-gif-list'));

        expect(gifListAfter).toBeTruthy();
        expect(spinnerAfter).toBeFalsy();
      });
    });
  });
});
