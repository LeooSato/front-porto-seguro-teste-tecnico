import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Course, CoursePayload, EnrollmentRequest } from '../../../shared/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly coursesUrl = `${environment.apiUrl}/courses`;
  private readonly enrollmentsUrl = `${environment.apiUrl}/enrollments`;

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl);
  }

  create(course: CoursePayload): Observable<Course> {
    return this.http.post<Course>(this.coursesUrl, course);
  }

  update(id: string, course: CoursePayload): Observable<Course> {
    return this.http.put<Course>(`${this.coursesUrl}/${id}`, course);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.coursesUrl}/${id}`);
  }

  enroll(payload: EnrollmentRequest): Observable<void> {
    return this.http.post<void>(this.enrollmentsUrl, payload);
  }
}
