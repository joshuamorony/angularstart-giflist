import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { RedditService } from '../shared/data-access/reddit.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GifListComponent } from './ui/gif-list.component';
import { MockGifListComponent } from './ui/gif-list.component.spec';
import { SearchBarComponent } from './ui/search-bar.component';
import { MockSearchBarComponent } from './ui/search-bar.component.spec';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const testGifs = [{}, {}, {}];
  const testControl = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: RedditService,
          useValue: {
            gifs: jest.fn().mockReturnValue(testGifs),
            subredditFormControl: testControl,
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
      gifList = fixture.debugElement.query(By.css('app-gif-list'));
    });

    describe('input: gifs', () => {
      it('should supply the gifs selector from the reddit service', () => {
        expect(gifList.componentInstance.gifs).toEqual(testGifs);
      });
    });
  });
});
