import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { EnrollmentOption, Task, TaskPayload } from '../../../../shared/models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-tasks-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TaskFormComponent
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUserSignal;

  tasks: Task[] = [];
  enrollmentOptions: EnrollmentOption[] = [];
  isLoading = false;
  isSaving = false;
  selectedTask: Task | null = null;

  get isStudent(): boolean {
    return this.user()?.role === 'STUDENT';
  }

  get title(): string {
    return this.selectedTask ? 'Editar tarefa' : 'Nova tarefa';
  }

  get submitLabel(): string {
    return this.selectedTask ? 'Atualizar' : 'Salvar';
  }

  ngOnInit(): void {
    if (!this.isStudent) {
      this.snackBar.open('Somente estudantes podem acessar tarefas.', 'Fechar', {
        duration: 4000
      });
      void this.router.navigate(['/home']);
      return;
    }

    this.loadTasks();
    this.loadEnrollments();
  }

  edit(task: Task): void {
    this.selectedTask = task;
  }

  saveTask(payload: TaskPayload): void {
    this.isSaving = true;

    const request$ = this.selectedTask
      ? this.taskService.update(this.selectedTask.id, payload)
      : this.taskService.create(payload);

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.selectedTask ? 'Tarefa atualizada com sucesso.' : 'Tarefa criada com sucesso.',
            'Fechar',
            { duration: 3000 }
          );
          this.cancelEdit();
          this.loadTasks();
        },
        error: (error: { error?: { message?: string } }) => {
          this.snackBar.open(error.error?.message ?? 'Nao foi possivel salvar a tarefa.', 'Fechar', {
            duration: 4000
          });
        }
      });
  }

  delete(task: Task): void {
    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.snackBar.open('Tarefa removida com sucesso.', 'Fechar', {
          duration: 3000
        });
        this.loadTasks();
      },
      error: (error: { error?: { message?: string } }) => {
        this.snackBar.open(error.error?.message ?? 'Nao foi possivel remover a tarefa.', 'Fechar', {
          duration: 4000
        });
      }
    });
  }

  cancelEdit(): void {
    this.selectedTask = null;
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  private loadTasks(): void {
    this.isLoading = true;

    this.taskService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error: { error?: { message?: string } }) => {
          this.tasks = [];
          this.snackBar.open(error.error?.message ?? 'Nao foi possivel carregar as tarefas.', 'Fechar', {
            duration: 4000
          });
        }
      });
  }

  private loadEnrollments(): void {
    this.taskService.getMyEnrollments().subscribe({
      next: (enrollments) => {
        this.enrollmentOptions = enrollments;
      },
      error: () => {
        this.enrollmentOptions = [];
      }
    });
  }

}
