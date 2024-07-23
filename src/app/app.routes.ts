import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { TaskieCardComponent } from './components/taskies/taskieCards/taskies-card.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from "./pages/profile/profile.component";
import { UsersComponent } from './pages/users/users.component';


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
            IRoleType.admin, 
            IRoleType.superAdmin                    
          ],
          name: 'Users'
        }
      },
      {
        path: "calendar",
        component: CalendarComponent,
        canActivate:[AuthGuard],
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Calendar",
        },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Profile",
        },
      },{
        path: "taskies",
        component: TaskieCardComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Taskies",
        },
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
