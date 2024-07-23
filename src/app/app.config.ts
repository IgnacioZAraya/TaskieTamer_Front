import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { baseUrlInterceptor } from "./interceptors/base-url.interceptor";
import { accessTokenInterceptor } from "./interceptors/access-token.interceptor";
import { handleErrorsInterceptor } from "./interceptors/handle-errors.interceptor";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), 
    provideAnimations(),
    provideToastr({ timeOut: 5000, preventDuplicates: true }),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        accessTokenInterceptor,
        //handleErrorsInterceptor
      ])
    ),
  ],
};
