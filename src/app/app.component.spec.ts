import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedditService } from './shared/data-access/reddit.service';
import { signal } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  const mockErrorSignal = signal<string | null>(null);
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: RedditService,
          useValue: {
            error: mockErrorSignal,
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    });

    snackBar = TestBed.inject(MatSnackBar);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('effects', () => {
    it('should open snack bar with error state when error changes', () => {
      const testError = 'some error';
      mockErrorSignal.set(testError);

      fixture.detectChanges();

      expect(snackBar.open).toHaveBeenCalledWith(testError, 'Dismiss', {
        duration: 2000,
      });
    });
    it('should not open snack bar for null error messages', () => {
      const testError = 'some error';
      mockErrorSignal.set(testError);
      fixture.detectChanges();
      mockErrorSignal.set(null);
      fixture.detectChanges();

      expect(snackBar.open).toHaveBeenCalledTimes(1);
    });
  });
});
