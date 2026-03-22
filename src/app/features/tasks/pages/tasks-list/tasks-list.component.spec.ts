import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { TasksListComponent } from './tasks-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { TaskService } from '../../services/task.service';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let router: Router;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', ['getAll', 'getMyEnrollments', 'create', 'update', 'delete']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    const authServiceStub: Pick<AuthService, 'currentUserSignal'> = {
      currentUserSignal: signal({
        sub: '1',
        email: 'student@test.com',
        role: 'STUDENT',
        name: 'Student User'
      })
    };

    taskServiceSpy.getAll.and.returnValue(of([
      {
        id: '1',
        enrollmentId: 'enr-1',
        date: '2026-03-22',
        category: 'PESQUISA',
        description: 'Research topic',
        timeSpent: 60
      }
    ]));
    taskServiceSpy.getMyEnrollments.and.returnValue(of([
      { id: 'enr-1', label: 'Angular Fundamentals' }
    ]));

    TestBed.overrideComponent(TasksListComponent, {
      set: {
        providers: [{ provide: MatSnackBar, useValue: snackBarSpy }]
      }
    });

    await TestBed.configureTestingModule({
      imports: [TasksListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks for student on init', () => {
    expect(taskServiceSpy.getAll).toHaveBeenCalled();
    expect(taskServiceSpy.getMyEnrollments).toHaveBeenCalled();
    expect(component.tasks.length).toBe(1);
  });

  it('should set selected task on edit', () => {
    const task = {
      id: '1',
      enrollmentId: 'enr-1',
      date: '2026-03-22',
      category: 'PESQUISA' as const,
      description: 'Research topic',
      timeSpent: 60
    };

    component.edit(task);

    expect(component.selectedTask).toEqual(task);
  });
});
