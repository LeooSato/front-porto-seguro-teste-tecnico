import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { CourseService } from '../../../courses/services/course.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUserSignal;

  isLoadingStats = false;
  coursesCount = 0;

  ngOnInit(): void {
    this.loadStats();
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  private loadStats(): void {
    this.isLoadingStats = true;

    this.courseService
      .getAll()
      .pipe(finalize(() => (this.isLoadingStats = false)))
      .subscribe({
        next: (courses) => {
          this.coursesCount = courses.length;
        },
        error: () => {
          this.coursesCount = 0;
          this.snackBar.open('Nao foi possivel carregar os indicadores agora.', 'Fechar', {
            duration: 4000
          });
        }
      });
  }
}
