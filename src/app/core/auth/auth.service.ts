import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthUser } from '../../shared/models/auth-user.model';
import { LoginRequest } from '../../shared/models/login-request.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly apiUrl = environment.apiUrl;

  private readonly authenticatedSignal = signal<boolean>(!!this.tokenService.getToken());
  private readonly userSignal = signal<AuthUser | null>(this.tokenService.getDecodedUser());

  readonly isAuthenticatedSignal = this.authenticatedSignal.asReadonly();
  readonly currentUserSignal = this.userSignal.asReadonly();

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(({ token }) => {
        this.tokenService.setToken(token);
        this.authenticatedSignal.set(true);
        this.userSignal.set(this.tokenService.getDecodedUser(token));
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.authenticatedSignal.set(false);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  isAuthenticated(): boolean {
    return this.authenticatedSignal();
  }
}
