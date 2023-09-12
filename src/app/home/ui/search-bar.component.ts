import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  template: `
    <div data-testid="subreddit-bar">
      <input type="text" [formControl]="subredditFormControl" />
    </div>
  `,
  imports: [ReactiveFormsModule],
})
export class SearchBarComponent {
  @Input({ required: true }) subredditFormControl!: FormControl;
}
