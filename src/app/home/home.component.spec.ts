import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { RedditService } from '../shared/data-access/reddit.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GifListComponent } from './ui/gif-list.component';
import { MockGifListComponent } from './ui/gif-list.component.spec';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const testGifs = [{}, {}, {}];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: RedditService,
          useValue: {
            gifs: jest.fn().mockReturnValue(testGifs),
          },
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [GifListComponent] },
        add: { imports: [MockGifListComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
