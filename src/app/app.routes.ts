import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard')
      .then(m => m.DashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports')
      .then(m => m.ReportsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users')
      .then(m => m.UsersComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login')
      .then(m => m.LoginComponent)
  }
];
