import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GifListComponent } from './gif-list.component';
import { By } from '@angular/platform-browser';
import { GifPlayerComponent } from './gif-player.component';
import { MockGifPlayerComponent } from './gif-player.component.spec';

import { Component, Input } from '@angular/core';
import { Gif } from 'src/app/shared/interfaces';
import { WINDOW } from 'src/app/shared/utils/injection-tokens';

@Component({
  standalone: true,
  selector: 'app-gif-list',
  template: ` <p>Hello world</p> `,
})
export class MockGifListComponent {
  @Input({ required: true }) gifs!: Gif[];
}

describe('GifListComponent', () => {
  let component: GifListComponent;
  let fixture: ComponentFixture<GifListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GifListComponent],
      providers: [
        {
          provide: WINDOW,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    })
      .overrideComponent(GifListComponent, {
        remove: { imports: [GifPlayerComponent] },
        add: { imports: [MockGifPlayerComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GifListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: gifs', () => {
    it('should render an app-gif-player for each element', () => {
      const testData = [{}, {}, {}] as any;
      component.gifs = testData;

      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(By.css('app-gif-player'));

      expect(items.length).toEqual(testData.length);
    });
  });

  describe('app-gif-player', () => {
    it('should use the src of the gif as the src input', () => {
      const testSrc = 'http://test.com/test.mp4';
      const testData = [{ src: testSrc }] as any;
      component.gifs = testData;

      fixture.detectChanges();

      const player = fixture.debugElement.query(By.css('app-gif-player'));

      expect(player.componentInstance.src).toEqual(testSrc);
    });

    it('should use the thumbnail of the gif as the thumbnail input', () => {
      const testThumb = 'test.png';
      const testData = [{ thumbnail: testThumb }] as any;
      component.gifs = testData;

      fixture.detectChanges();

      const player = fixture.debugElement.query(By.css('app-gif-player'));

      expect(player.componentInstance.thumbnail).toEqual(testThumb);
    });
  });

  describe('title bar', () => {
    it('should launch the permalink when comments clicked', () => {
      const testLink = 'https://google.com';
      const testData = [{ permalink: testLink }] as any;
      const window = TestBed.inject(WINDOW);

      component.gifs = testData;

      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css('a'));

      link.nativeElement.click();

      expect(window.open).toHaveBeenCalledWith(testLink);
    });
  });
});
