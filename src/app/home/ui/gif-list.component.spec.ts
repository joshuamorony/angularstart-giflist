import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GifListComponent } from './gif-list.component';
import { By } from '@angular/platform-browser';

describe('GifListComponent', () => {
  let component: GifListComponent;
  let fixture: ComponentFixture<GifListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GifListComponent],
    })
      .overrideComponent(GifListComponent, {
        remove: { imports: [] },
        add: { imports: [] },
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
});
