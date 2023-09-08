import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GifPlayerComponent } from './gif-player.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

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

  describe('video', () => {
    let video: DebugElement;

    beforeEach(() => {
      video = fixture.debugElement.query(By.css('video'));
      video.nativeElement.pause = jest.fn();
      video.nativeElement.play = jest.fn();
    });

    it('should play when video finishes loading', () => {
      expect(false).toBeTruthy();
    });

    describe('ready when clicked', () => {
      beforeEach(() => {
        Object.defineProperty(video, 'readyState', {
          get: jest.fn(() => 4),
        });
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
        expect(false).toBeTruthy();
      });
    });
  });
});
