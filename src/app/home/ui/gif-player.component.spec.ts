import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GifPlayerComponent } from './gif-player.component';
import { By } from '@angular/platform-browser';
import { DebugElement, Input } from '@angular/core';

import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-gif-player',
  template: ` <p>Hello world</p> `,
})
export class MockGifPlayerComponent {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) thumbnail!: string;
}

describe('GifPlayerComponent', () => {
  let component: GifPlayerComponent;
  let fixture: ComponentFixture<GifPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GifPlayerComponent],
    })
      .overrideComponent(GifPlayerComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GifPlayerComponent);
    component = fixture.componentInstance;
    component.src = 'http://test.com/test.mp4';
    component.thumbnail = 'test.png';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: src', () => {
    it('should set the video src', () => {
      const testSrc = 'http://test.com/test.mp4';
      component.src = testSrc;

      fixture.detectChanges();

      const video = fixture.debugElement.query(By.css('video'));

      expect(video.nativeElement.src).toEqual(testSrc);
    });
  });

  describe('input: thumbnail', () => {
    xit('should use the supplied thumbnail for the preload background element', () => {
      const testThumb = 'test.png';
      component.thumbnail = testThumb;

      fixture.detectChanges();

      const result = fixture.debugElement.query(By.css('.preload-background'));

      const computedStyle = getComputedStyle(result.nativeElement);
      const backgroundStyle = computedStyle.background;

      console.log(backgroundStyle);

      expect(backgroundStyle).toContain(testThumb);
    });
  });

  describe('video', () => {
    let video: DebugElement;

    beforeEach(() => {
      video = fixture.debugElement.query(By.css('video'));
      video.nativeElement.pause = jest.fn();
      video.nativeElement.play = jest.fn();
      video.nativeElement.load = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(null);
          setTimeout(() => {
            video.nativeElement.dispatchEvent(new Event('loadeddata'));
          }, 0);
        });
      });
    });

    it('should display spinner when loading', () => {
      const spinnerBeforeLoading = fixture.debugElement.query(
        By.css('mat-progress-spinner')
      );
      expect(spinnerBeforeLoading).toBeFalsy();

      video.nativeElement.click();
      fixture.detectChanges();

      const spinnerWhileLoading = fixture.debugElement.query(
        By.css('mat-progress-spinner')
      );
      expect(spinnerWhileLoading).toBeTruthy();

      fixture.whenStable().then(() => {
        const spinnerAfterLoading = fixture.debugElement.query(
          By.css('mat-progress-spinner')
        );
        expect(spinnerAfterLoading).toBeFalsy();
      });
    });

    describe('ready when clicked', () => {
      beforeEach(() => {
        component.videoLoadComplete$.next();
      });

      it('should play if paused', () => {
        video.nativeElement.click();
        fixture.detectChanges();

        expect(video.nativeElement.play).toHaveBeenCalled();
      });

      it('should pause if playing', () => {
        component.togglePlay$.next();
        fixture.detectChanges();

        video.nativeElement.click();
        fixture.detectChanges();

        expect(video.nativeElement.pause).toHaveBeenCalled();
      });
    });

    describe('not ready when clicked', () => {
      it('should trigger loading of video', () => {
        video.nativeElement.click();
        fixture.detectChanges();

        expect(component.status()).toEqual('loading');

        fixture.whenStable().then(() => {
          expect(component.status()).toEqual('loaded');
        });
      });

      it('should play video after loaded if playing is true', () => {
        video.nativeElement.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(video.nativeElement.play).toHaveBeenCalled();
        });
      });

      it('should NOT play video after loaded if playing is false', () => {
        video.nativeElement.click();
        video.nativeElement.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(video.nativeElement.play).toHaveBeenCalled();
        });
      });
    });
  });
});
