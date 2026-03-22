import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { CourseService } from '../../../courses/services/course.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceStub: Pick<AuthService, 'currentUserSignal' | 'logout'>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceStub = {
      currentUserSignal: signal({
        sub: '1',
        email: 'student@test.com',
        role: 'STUDENT',
        name: 'Student User'
      }),
      logout: jasmine.createSpy('logout')
    };

    courseServiceSpy = jasmine.createSpyObj<CourseService>('CourseService', ['getAll']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    courseServiceSpy.getAll.and.returnValue(of([{ id: '1', name: 'Angular', description: 'Desc' }]));

    TestBed.overrideComponent(HomeComponent, {
      set: {
        providers: [{ provide: MatSnackBar, useValue: snackBarSpy }]
      }
    });

    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
        { provide: CourseService, useValue: courseServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load course count on init', () => {
    expect(courseServiceSpy.getAll).toHaveBeenCalled();
    expect(component.coursesCount).toBe(1);
  });

  it('should fallback and notify when stats fail', () => {
    courseServiceSpy.getAll.and.returnValue(throwError(() => ({ status: 500 })));

    component.ngOnInit();

    expect(component.coursesCount).toBe(0);
    expect(snackBarSpy.open).toHaveBeenCalled();
  });
});
