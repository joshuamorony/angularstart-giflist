import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('The window object', {
  factory: () => window,
});
