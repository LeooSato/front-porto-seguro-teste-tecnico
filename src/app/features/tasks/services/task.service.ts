import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { EnrollmentOption, Task, TaskPayload } from '../../../shared/models/task.model';

interface TaskApiDto {
  id: string;
  enrollmentId: string;
  date: string;
  category: Task['category'];
  description: string;
  timeSpentMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;
  private readonly enrollmentsMyUrl = `${environment.apiUrl}/enrollments/my`;

  getAll(): Observable<Task[]> {
    return this.http
      .get<TaskApiDto[]>(this.tasksUrl)
      .pipe(map((tasks) => tasks.map((task) => this.toTask(task))));
  }

  getMyEnrollments(): Observable<EnrollmentOption[]> {
    return this.http
      .get<Array<Record<string, unknown>>>(this.enrollmentsMyUrl)
      .pipe(
        map((items) =>
          items
            .map((item) => {
              const id = String(item['id'] ?? item['enrollmentId'] ?? '');
              const courseObj = item['course'] as { name?: unknown } | undefined;
              const label = String(item['courseName'] ?? courseObj?.name ?? id);

              return { id, label };
            })
            .filter((option) => option.id.length > 0)
        )
      );
  }

  create(task: TaskPayload): Observable<Task> {
    return this.http
      .post<TaskApiDto>(this.tasksUrl, task)
      .pipe(map((created) => this.toTask(created)));
  }

  update(id: string, task: TaskPayload): Observable<Task> {
    return this.http
      .put<TaskApiDto>(`${this.tasksUrl}/${id}`, task)
      .pipe(map((updated) => this.toTask(updated)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.tasksUrl}/${id}`);
  }

  private toTask(task: TaskApiDto): Task {
    return {
      id: task.id,
      enrollmentId: task.enrollmentId,
      date: task.date,
      category: task.category,
      description: task.description,
      timeSpent: task.timeSpentMinutes
    };
  }
}
