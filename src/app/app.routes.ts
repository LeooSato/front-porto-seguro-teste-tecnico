import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { CoursesComponent } from './features/courses/pages/courses/courses.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { TasksListComponent } from './features/tasks/pages/tasks-list/tasks-list.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'home', component: HomeComponent, canActivate: [authGuard] },
	{ path: 'courses', component: CoursesComponent, canActivate: [authGuard] },
	{ path: 'tasks', component: TasksListComponent, canActivate: [authGuard] },
	{ path: '**', redirectTo: 'home' }
];
