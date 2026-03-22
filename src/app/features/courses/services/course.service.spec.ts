import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CourseService } from './course.service';
import { environment } from '../../../../environments/environment';
import { Course } from '../../../shared/models/course.model';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const coursesUrl = `${environment.apiUrl}/courses`;
  const enrollmentsUrl = `${environment.apiUrl}/enrollments`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list courses', () => {
    const courses: Course[] = [
      { id: '1', name: 'Angular Fundamentals', description: 'Angular from zero to hero' }
    ];

    service.getAll().subscribe((response) => {
      expect(response).toEqual(courses);
    });

    const req = httpMock.expectOne(coursesUrl);
    expect(req.request.method).toBe('GET');
    req.flush(courses);
  });

  it('should create a course', () => {
    const payload = { name: 'Node.js API', description: 'REST API with Node.js' };
    const created: Course = { id: '2', ...payload };

    service.create(payload).subscribe((response) => {
      expect(response).toEqual(created);
    });

    const req = httpMock.expectOne(coursesUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
  });

  it('should update a course', () => {
    const payload = { name: 'Node.js API Advanced', description: 'REST API advanced patterns' };
    const updated: Course = { id: '2', ...payload };

    service.update('2', payload).subscribe((response) => {
      expect(response).toEqual(updated);
    });

    const req = httpMock.expectOne(`${coursesUrl}/2`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updated);
  });

  it('should delete a course', () => {
    service.delete('3').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${coursesUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should enroll in a course', () => {
    service.enroll({ courseId: '3' }).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(enrollmentsUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ courseId: '3' });
    req.flush(null);
  });
});
