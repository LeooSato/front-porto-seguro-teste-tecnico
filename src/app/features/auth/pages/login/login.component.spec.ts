import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.overrideComponent(LoginComponent, {
      set: {
        providers: [{ provide: MatSnackBar, useValue: snackBarSpy }]
      }
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login when form is invalid', () => {
    component.submit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login and navigate to home on success', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'jwt-token' }));
    component.form.setValue({
      email: 'student@test.com',
      password: '123456'
    });

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'student@test.com',
      password: '123456'
    });
    expect(snackBarSpy.open).toHaveBeenCalledWith('Login realizado com sucesso.', 'Fechar', {
      duration: 3000
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show user-friendly message on 401', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));
    component.form.setValue({
      email: 'student@test.com',
      password: 'wrong-pass'
    });

    component.submit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Email ou senha invalidos.', 'Fechar', {
      duration: 4000
    });
  });
});
