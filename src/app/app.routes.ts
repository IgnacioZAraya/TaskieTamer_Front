import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRole } from './interfaces';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from "./pages/profile/profile.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";


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
        path: "calendar",
        component: CalendarComponent,
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
