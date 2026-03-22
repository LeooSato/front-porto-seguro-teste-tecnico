import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'logout']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorization header for private endpoints', () => {
    authServiceSpy.getToken.and.returnValue('jwt-token');

    http.get('/courses').subscribe();

    const req = httpMock.expectOne('/courses');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush({});
  });

  it('should skip authorization header for public endpoints', () => {
    authServiceSpy.getToken.and.returnValue('jwt-token');

    http.post('/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ token: 'jwt-token' });
  });

  it('should logout and redirect on unauthorized response', () => {
    authServiceSpy.getToken.and.returnValue('jwt-token');

    http.get('/courses').subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/courses');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
