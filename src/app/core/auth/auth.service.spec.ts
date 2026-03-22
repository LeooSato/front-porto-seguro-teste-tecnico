import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should login and persist token', () => {
    const requestBody = {
      email: 'student@test.com',
      password: '123456'
    };

    service.login(requestBody).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestBody);

    req.flush({ token: 'jwt-token' });

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should clear auth state on logout', () => {
    tokenService.setToken('jwt-token');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUserSignal()).toBeNull();
  });
});
