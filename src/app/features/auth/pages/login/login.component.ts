import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { LoginRequest } from '../../../../shared/models/login-request.model';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = false;

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    const request: LoginRequest = this.form.getRawValue();
    this.isLoading = true;

    this.authService
      .login(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Login realizado com sucesso.', 'Fechar', {
            duration: 3000
          });
          void this.router.navigate(['/home']);
        },
        error: (error: { status?: number; error?: { message?: string } }) => {
          const message = error.status === 401
            ? 'Email ou senha invalidos.'
            : error.error?.message ?? 'Nao foi possivel realizar o login.';

          this.snackBar.open(message, 'Fechar', {
            duration: 4000
          });
        }
      });
  }
}
