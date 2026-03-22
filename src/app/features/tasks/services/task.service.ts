import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Task, TaskPayload } from '../../../shared/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  create(task: TaskPayload): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, task);
  }

  update(id: string, task: TaskPayload): Observable<Task> {
    return this.http.put<Task>(`${this.tasksUrl}/${id}`, task);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.tasksUrl}/${id}`);
  }
}
