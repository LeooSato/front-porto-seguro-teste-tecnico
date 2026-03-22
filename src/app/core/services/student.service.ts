import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StudentRequest } from '../models/student-request.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  createStudent(student: StudentRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/students`, student);
  }
}
