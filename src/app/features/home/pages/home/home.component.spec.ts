import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal, WritableSignal } from '@angular/core';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { CourseService } from '../../../courses/services/course.service';
import { TaskService } from '../../../tasks/services/task.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceStub: { currentUserSignal: WritableSignal<{ sub: string; email: string; role: 'ADMIN' | 'STUDENT'; name: string }>; logout: jasmine.Spy };
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const userSignal = signal<{ sub: string; email: string; role: 'ADMIN' | 'STUDENT'; name: string }>({
        sub: '1',
        email: 'student@test.com',
        role: 'STUDENT',
        name: 'Student User'
      });

    authServiceStub = {
      currentUserSignal: userSignal,
      logout: jasmine.createSpy('logout')
    };

    courseServiceSpy = jasmine.createSpyObj<CourseService>('CourseService', ['getAll']);
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', ['getAll', 'getMyEnrollments']);
    courseServiceSpy.getAll.and.returnValue(
      of([
        { id: '1', name: 'Angular', description: 'Desc' },
        { id: '2', name: 'Spring', description: 'Desc' }
      ])
    );
    taskServiceSpy.getAll.and.returnValue(
      of([
        {
          id: '1',
          enrollmentId: 'enr-1',
          date: '2026-03-22',
          category: 'PESQUISA',
          description: 'Research architecture',
          timeSpent: 60
        }
      ])
    );
    taskServiceSpy.getMyEnrollments.and.returnValue(of([{ id: 'enr-1', label: 'Angular' }]));

    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard metrics on init for student role', () => {
    expect(courseServiceSpy.getAll).toHaveBeenCalled();
    expect(taskServiceSpy.getAll).toHaveBeenCalled();
    expect(taskServiceSpy.getMyEnrollments).toHaveBeenCalled();

    expect(component.enrollmentsCount).toBe(1);
    expect(component.tasksCount).toBe(1);
    expect(component.coursesCount).toBe(2);
  });

  it('should expose student quick actions', () => {
    const actions = component.quickActions.map((item) => item.label);

    expect(actions).toContain('View Courses');
    expect(actions).toContain('My Tasks');
    expect(actions).toContain('My Enrollments');
  });

  it('should expose admin quick actions', () => {
    taskServiceSpy.getMyEnrollments.calls.reset();

    authServiceStub.currentUserSignal.set({
      sub: '2',
      email: 'admin@test.com',
      role: 'ADMIN',
      name: 'Admin User'
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(taskServiceSpy.getMyEnrollments).not.toHaveBeenCalled();

    const actions = component.quickActions.map((item) => item.label);
    expect(actions).toContain('Manage Courses');
    expect(actions).toContain('Create Course');
  });
});
