import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRole } from './interfaces';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from "./pages/profile/profile.component";
import { UsersComponent } from './pages/users/users.component';

import { TaskieComponent } from './pages/taskies/taskie.component';


export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "access-denied",
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full',
  },
  {
    path: "app",
    component: AppLayoutComponent,
    children: [
      {
        path: 'app',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: "users",
        component: UsersComponent,
        canActivate:[ AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin                    
          ],
          name: 'Users'
        }
      },
      {
        path: "calendar",
        component: CalendarComponent,
        canActivate:[AuthGuard],
        data: {
          authorities: [IRole.admin, IRole.superAdmin, IRole.user],
          name: "Calendar",
        },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: {
          authorities: [IRole.admin, IRole.superAdmin, IRole.user],
          name: "Profile",
        },
      },{
        path: "taskies",
        component: TaskieComponent,
        data: {
          authorities: [IRole.admin, IRole.superAdmin, IRole.user],
          name: "Taskies",
        },
        },{ path: '', 
          redirectTo: '/taskies', 
          pathMatch: 'full' },
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
