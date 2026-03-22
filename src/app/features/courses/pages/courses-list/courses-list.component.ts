import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Course } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-courses-list',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})
export class CoursesListComponent {
  @Input() courses: Course[] = [];
  @Input() isLoading = false;
  @Input() isAdmin = false;
  @Input() enrollingCourseId: string | null = null;

  @Output() createClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<Course>();
  @Output() deleteClick = new EventEmitter<Course>();
  @Output() enrollClick = new EventEmitter<Course>();

}
