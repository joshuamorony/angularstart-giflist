import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
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
      video.nativeElement.load = jest.fn().mockImplementation(async () => {
        await Promise.resolve();
        video.triggerEventHandler('loadeddata', null);
      });
    });

    it('should play when video finishes loading', () => {
      expect(false).toBeTruthy();
    });

    describe('ready when clicked', () => {
      beforeEach(() => {
        video.triggerEventHandler('loadeddata', null);
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
      it('should trigger loading of video', fakeAsync(() => {
        video.nativeElement.click();
        fixture.detectChanges();

        expect(component.status()).toEqual('loading');
        tick();
        expect(component.status()).toEqual('loaded');
      }));

      it('should play video after loaded if playing is true', () => {
        expect(false).toBeTruthy();
      });
      it('should NOT play video after loaded if playing is false', () => {
        expect(false).toBeTruthy();
      });
    });
  });
});
