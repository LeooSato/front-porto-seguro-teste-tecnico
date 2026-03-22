import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth.service';

const PUBLIC_ENDPOINTS = ['/auth/login', '/students'];

const isPublicEndpoint = (url: string): boolean =>
  PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const token = authService.getToken();
  const isPublicRequest = isPublicEndpoint(req.url);

  const authReq = !token || isPublicRequest
    ? req
    : req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicRequest) {
        authService.logout();
        snackBar.open('Sua sessao expirou. Entre novamente para continuar.', 'Fechar', {
          duration: 4000
        });
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
