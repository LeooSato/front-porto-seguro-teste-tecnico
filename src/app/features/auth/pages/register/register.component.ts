import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { StudentService } from '../../../../core/services/student.service';
import { StudentRequest } from '../../../../core/models/student-request.model';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly studentService = inject(StudentService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthDate: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });

  isLoading = false;

  get firstName() {
    return this.form.controls.firstName;
  }

  get lastName() {
    return this.form.controls.lastName;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  get birthDate() {
    return this.form.controls.birthDate;
  }

  get phone() {
    return this.form.controls.phone;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: StudentRequest = this.form.getRawValue();
    this.isLoading = true;

    this.studentService
      .createStudent(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Aluno cadastrado com sucesso.', 'Fechar', {
            duration: 3000
          });
          this.form.reset({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: '',
            phone: ''
          });
          this.router.navigate(['/login']);
        },
        error: (error: { error?: { message?: string }; message?: string }) => {
          const message = error.error?.message ?? error.message ?? 'Não foi possível cadastrar o aluno.';
          this.snackBar.open(message, 'Fechar', {
            duration: 4000
          });
        }
      });
  }

}
