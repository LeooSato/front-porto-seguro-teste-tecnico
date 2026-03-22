import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TaskService } from './task.service';
import { environment } from '../../../../environments/environment';
import { Task } from '../../../shared/models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const tasksUrl = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list tasks', () => {
    const tasks: Task[] = [
      {
        id: '1',
        date: '2026-03-22',
        category: 'PESQUISA',
        description: 'Research JWT security',
        timeSpent: 60
      }
    ];

    service.getAll().subscribe((response) => {
      expect(response).toEqual(tasks);
    });

    const req = httpMock.expectOne(tasksUrl);
    expect(req.request.method).toBe('GET');
    req.flush(tasks);
  });

  it('should create task', () => {
    const payload = {
      date: '2026-03-22',
      category: 'PRATICA' as const,
      description: 'Hands-on API integration',
      timeSpent: 90
    };

    const created: Task = {
      id: '2',
      ...payload
    };

    service.create(payload).subscribe((response) => {
      expect(response).toEqual(created);
    });

    const req = httpMock.expectOne(tasksUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
  });

  it('should update task', () => {
    const payload = {
      date: '2026-03-22',
      category: 'ASSISTIR_VIDEOAULA' as const,
      description: 'Watch architecture class',
      timeSpent: 120
    };

    const updated: Task = {
      id: '2',
      ...payload
    };

    service.update('2', payload).subscribe((response) => {
      expect(response).toEqual(updated);
    });

    const req = httpMock.expectOne(`${tasksUrl}/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updated);
  });

  it('should delete task', () => {
    service.delete('3').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${tasksUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
