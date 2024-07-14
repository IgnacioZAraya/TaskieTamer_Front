import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRole } from './interfaces';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      {
        path: 'app',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AuthGuard, AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          name: 'Users'
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Dashboard'
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          name: 'Home'
        }
      }
    ],
  },
];
