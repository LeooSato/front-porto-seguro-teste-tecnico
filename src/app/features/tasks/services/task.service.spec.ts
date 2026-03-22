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
  const enrollmentsMyUrl = `${environment.apiUrl}/enrollments/my`;

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
    const tasksApi = [
      {
        id: '1',
        enrollmentId: 'enr-1',
        date: '2026-03-22',
        category: 'PESQUISA',
        description: 'Research JWT security',
        timeSpentMinutes: 60
      }
    ];

    const expected: Task[] = [
      {
        id: '1',
        enrollmentId: 'enr-1',
        date: '2026-03-22',
        category: 'PESQUISA',
        description: 'Research JWT security',
        timeSpent: 60
      }
    ];

    service.getAll().subscribe((response) => {
      expect(response).toEqual(expected);
    });

    const req = httpMock.expectOne(tasksUrl);
    expect(req.request.method).toBe('GET');
    req.flush(tasksApi);
  });

  it('should list student enrollments', () => {
    service.getMyEnrollments().subscribe((response) => {
      expect(response).toEqual([
        { id: 'enr-1', label: 'Angular Fundamentals' }
      ]);
    });

    const req = httpMock.expectOne(enrollmentsMyUrl);
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        id: 'enr-1',
        courseName: 'Angular Fundamentals'
      }
    ]);
  });

  it('should create task', () => {
    const payload = {
      enrollmentId: 'enr-1',
      date: '2026-03-22',
      category: 'PRATICA' as const,
      description: 'Hands-on API integration',
      timeSpentMinutes: 90
    };

    const createdApi = {
      id: '2',
      ...payload
    };

    const created: Task = {
      id: '2',
      enrollmentId: 'enr-1',
      date: '2026-03-22',
      category: 'PRATICA',
      description: 'Hands-on API integration',
      timeSpent: 90
    };

    service.create(payload).subscribe((response) => {
      expect(response).toEqual(created);
    });

    const req = httpMock.expectOne(tasksUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(createdApi);
  });

  it('should update task', () => {
    const payload = {
      enrollmentId: 'enr-1',
      date: '2026-03-22',
      category: 'ASSISTIR_VIDEOAULA' as const,
      description: 'Watch architecture class',
      timeSpentMinutes: 120
    };

    const updatedApi = {
      id: '2',
      ...payload
    };

    const updated: Task = {
      id: '2',
      enrollmentId: 'enr-1',
      date: '2026-03-22',
      category: 'ASSISTIR_VIDEOAULA',
      description: 'Watch architecture class',
      timeSpent: 120
    };

    service.update('2', payload).subscribe((response) => {
      expect(response).toEqual(updated);
    });

    const req = httpMock.expectOne(`${tasksUrl}/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updatedApi);
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
