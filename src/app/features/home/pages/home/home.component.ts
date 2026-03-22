import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { Task } from '../../../../shared/models/task.model';
import { CourseService } from '../../../courses/services/course.service';
import { TaskService } from '../../../tasks/services/task.service';

interface StatCard {
  title: string;
  value: number;
  icon: string;
}

interface QuickAction {
  label: string;
  subtitle: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUserSignal;

  isLoading = false;
  hasLoadError = false;

  coursesCount = 0;
  enrollmentsCount = 0;
  tasksCount = 0;
  tasksThisWeek = 0;

  topCourses: Array<{ id: string; name: string; description: string }> = [];
  recentTasks: Task[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  get role(): 'ADMIN' | 'STUDENT' {
    return this.user()?.role === 'ADMIN' ? 'ADMIN' : 'STUDENT';
  }

  get subtitle(): string {
    return this.role === 'ADMIN'
      ? 'Manage your platform'
      : 'Track your learning progress';
  }

  get stats(): StatCard[] {
    if (this.role === 'ADMIN') {
      return [
        { title: 'Total courses', value: this.coursesCount, icon: 'school' },
        { title: 'Tasks logged', value: this.tasksCount, icon: 'task_alt' },
        { title: 'Activity this week', value: this.tasksThisWeek, icon: 'calendar_month' }
      ];
    }

    return [
      { title: 'Enrolled courses', value: this.enrollmentsCount, icon: 'menu_book' },
      { title: 'Tasks logged', value: this.tasksCount, icon: 'check_circle' },
      { title: 'Tasks this week', value: this.tasksThisWeek, icon: 'calendar_month' }
    ];
  }

  get quickActions(): QuickAction[] {
    if (this.role === 'ADMIN') {
      return [
        {
          label: 'Manage Courses',
          subtitle: 'Review and update the catalog',
          route: '/courses',
          icon: 'settings'
        },
        {
          label: 'Create Course',
          subtitle: 'Add a new course entry',
          route: '/courses',
          icon: 'add_circle'
        }
      ];
    }

    return [
      {
        label: 'View Courses',
        subtitle: 'Explore available courses',
        route: '/courses',
        icon: 'school'
      },
      {
        label: 'My Tasks',
        subtitle: 'Log and review study efforts',
        route: '/tasks',
        icon: 'task'
      },
      {
        label: 'My Enrollments',
        subtitle: 'Check your active enrollments',
        route: '/courses',
        icon: 'fact_check'
      }
    ];
  }

  get progressPercent(): number {
    return Math.min(100, this.tasksThisWeek * 20);
  }

  get mostRecentTask(): Task | null {
    return this.recentTasks.length > 0 ? this.recentTasks[0] : null;
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.hasLoadError = false;

    const safeCourses$ = this.courseService.getAll().pipe(catchError(() => of([])));
    const safeTasks$ = this.taskService.getAll().pipe(catchError(() => of([])));

    if (this.role === 'ADMIN') {
      forkJoin({
        courses: safeCourses$,
        tasks: safeTasks$
      })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(({ courses, tasks }) => {
          this.coursesCount = courses.length;
          this.enrollmentsCount = 0;
          this.applyTaskMetrics(tasks);
          this.topCourses = courses.slice(0, 3);
          this.hasLoadError = false;
        });

      return;
    }

    forkJoin({
      courses: safeCourses$,
      tasks: safeTasks$,
      enrollments: this.taskService.getMyEnrollments().pipe(catchError(() => of([])))
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(({ courses, tasks, enrollments }) => {
        this.coursesCount = courses.length;
        this.enrollmentsCount = enrollments.length;
        this.applyTaskMetrics(tasks);
        this.topCourses = courses.slice(0, 3);
        this.hasLoadError = false;
      });
  }

  private applyTaskMetrics(tasks: Task[]): void {
    const sorted = [...tasks].sort((a, b) => b.date.localeCompare(a.date));
    this.tasksCount = sorted.length;
    this.recentTasks = sorted.slice(0, 5);

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diffToMonday);
    weekStart.setHours(0, 0, 0, 0);

    this.tasksThisWeek = sorted.filter((task) => {
      const taskDate = new Date(`${task.date}T00:00:00`);
      return taskDate >= weekStart;
    }).length;
  }
}
