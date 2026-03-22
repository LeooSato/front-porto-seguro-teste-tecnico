import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('should store and retrieve token', () => {
    service.setToken('jwt-token');

    expect(service.getToken()).toBe('jwt-token');
  });

  it('should clear token from storage', () => {
    service.setToken('jwt-token');

    service.clearToken();

    expect(service.getToken()).toBeNull();
  });

  it('should decode token payload to user info', () => {
    const payload = btoa(
      JSON.stringify({
        sub: '1',
        email: 'admin@test.com',
        role: 'ADMIN',
        name: 'Admin User'
      })
    );
    const token = `header.${payload}.signature`;

    expect(service.getDecodedUser(token)).toEqual({
      sub: '1',
      email: 'admin@test.com',
      role: 'ADMIN',
      name: 'Admin User'
    });
  });
});
