import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    })
      .overrideComponent(SearchBarComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    component.subredditFormControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: subredditFormControl', () => {
    it('form control should update when input supplied', () => {
      const testInput = 'hello';

      const input = fixture.debugElement.query(
        By.css('[data-testid="subreddit-bar"] input')
      );

      input.nativeElement.value = testInput;
      input.nativeElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.subredditFormControl.value).toEqual(testInput);
    });
  });
});
