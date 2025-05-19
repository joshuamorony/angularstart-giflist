import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideCheckNoChangesConfig({
      exhaustive: true,
      interval: 500,
    }),
    provideHttpClient(),
    importProvidersFrom(MatSnackBarModule),
    provideAnimations(),
  ],
};
