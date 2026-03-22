import { Injectable } from '@angular/core';

import { AuthUser } from '../../shared/models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly storageKey = 'auth_token';

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
  }

  getDecodedUser(token: string | null = this.getToken()): AuthUser | null {
    if (!token) {
      return null;
    }

    try {
      const payload = this.decodeJwtPayload(token);
      return {
        sub: String(payload['sub'] ?? ''),
        email: String(payload['email'] ?? ''),
        role: payload['role'] === 'ADMIN' ? 'ADMIN' : 'STUDENT',
        name: String(payload['name'] ?? '')
      };
    } catch {
      return null;
    }
  }

  private decodeJwtPayload(token: string): Record<string, unknown> {
    const payloadPart = token.split('.')[1];

    if (!payloadPart) {
      throw new Error('Invalid JWT payload.');
    }

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);

    return JSON.parse(decoded) as Record<string, unknown>;
  }
}
