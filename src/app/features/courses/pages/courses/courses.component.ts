import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { Course, CoursePayload } from '../../../../shared/models/course.model';
import { CourseService } from '../../services/course.service';
import { CourseFormComponent } from '../course-form/course-form.component';
import { CoursesListComponent } from '../courses-list/courses-list.component';

@Component({
  selector: 'app-courses',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    CoursesListComponent,
    CourseFormComponent
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUserSignal;

  courses: Course[] = [];
  isLoading = false;
  isFormVisible = false;
  isSaving = false;
  enrollmentCourseId: string | null = null;
  selectedCourse: Course | null = null;

  get isAdmin(): boolean {
    return this.user()?.role === 'ADMIN';
  }

  get formTitle(): string {
    return this.selectedCourse ? 'Editar curso' : 'Criar curso';
  }

  get submitLabel(): string {
    return this.selectedCourse ? 'Atualizar' : 'Salvar';
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  openCreate(): void {
    if (!this.isAdmin) {
      return;
    }

    this.selectedCourse = null;
    this.isFormVisible = true;
  }

  edit(course: Course): void {
    if (!this.isAdmin) {
      return;
    }

    this.selectedCourse = course;
    this.isFormVisible = true;
  }

  saveCourse(payload: CoursePayload): void {
    if (!this.isAdmin) {
      return;
    }

    this.isSaving = true;

    const request$ = this.selectedCourse
      ? this.courseService.update(this.selectedCourse.id, payload)
      : this.courseService.create(payload);

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.selectedCourse ? 'Curso atualizado com sucesso.' : 'Curso criado com sucesso.',
            'Fechar',
            { duration: 3000 }
          );
          this.cancelForm();
          this.loadCourses();
        },
        error: (error: { error?: { message?: string } }) => {
          this.snackBar.open(error.error?.message ?? 'Nao foi possivel salvar o curso.', 'Fechar', {
            duration: 4000
          });
        }
      });
  }

  delete(course: Course): void {
    if (!this.isAdmin) {
      return;
    }

    this.courseService.delete(course.id).subscribe({
      next: () => {
        this.snackBar.open('Curso excluido com sucesso.', 'Fechar', {
          duration: 3000
        });
        this.loadCourses();
      },
      error: (error: { error?: { message?: string } }) => {
        this.snackBar.open(error.error?.message ?? 'Nao foi possivel excluir o curso.', 'Fechar', {
          duration: 4000
        });
      }
    });
  }

  enroll(course: Course): void {
    if (this.isAdmin || this.enrollmentCourseId) {
      return;
    }

    this.enrollmentCourseId = course.id;

    this.courseService
      .enroll({ courseId: course.id })
      .pipe(finalize(() => (this.enrollmentCourseId = null)))
      .subscribe({
        next: () => {
          this.snackBar.open('Matricula realizada com sucesso.', 'Fechar', {
            duration: 3000
          });
        },
        error: (error: { error?: { message?: string } }) => {
          this.snackBar.open(error.error?.message ?? 'Nao foi possivel concluir a matricula.', 'Fechar', {
            duration: 4000
          });
        }
      });
  }

  cancelForm(): void {
    this.selectedCourse = null;
    this.isFormVisible = false;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  private loadCourses(): void {
    this.isLoading = true;

    this.courseService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (courses) => {
          this.courses = courses;
        },
        error: (error: { error?: { message?: string } }) => {
          this.courses = [];
          this.snackBar.open(error.error?.message ?? 'Nao foi possivel carregar os cursos.', 'Fechar', {
            duration: 4000
          });
        }
      });
  }
}
