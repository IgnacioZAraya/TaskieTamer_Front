import { Routes } from "@angular/router";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { TaskieViewComponent } from "./components/taskies/taskieCards/taskies-card.component";
import { AdminRoleGuard } from "./guards/admin-role.guard";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { IRoleType } from "./interfaces";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { UsersComponent } from "./pages/users/users.component";

import { TaskieComponent } from "./pages/taskies/taskiescard.component";
import { TaskieDexComponent } from "./components/taskies/taskieDex/taskiesDex.component";

import { TaskHistoryComponent } from "./pages/task-history/task-history.component";
import { TaskNextComponent } from "./pages/task-next/task-next.component";
import { AssociateRoleGuard } from "./guards/associate-role.guard";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "access-denied",
    component: AccessDeniedComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuestGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: "app",
    component: AppLayoutComponent,
    children: [
      {
        path: 'app',
        redirectTo: '/home',
        pathMatch: 'full',

      },
      {
        path: "users",
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.superAdmin],
          name: "Users",
        },
      },
      {
        path: "taskHistory",
        canActivate: [AuthGuard],
        component: TaskHistoryComponent,
        data: {
          authorities: [
            IRoleType.associate,
            IRoleType.superAdmin,
            IRoleType.base,
          ],
          name: "Task History",
        },
      },
      {
        path: "NextTask",
        canActivate: [AuthGuard],
        component: TaskNextComponent,
        data: {
          authorities: [
            IRoleType.associate,
            IRoleType.superAdmin,
            IRoleType.base,
          ],
          name: "Upcoming Tasks",
        },
      },
      {
        path: "calendar",
        component: CalendarComponent,
        canActivate: [AuthGuard, AssociateRoleGuard],
        data: {
          authorities: [
            IRoleType.associate,
            IRoleType.superAdmin,
            IRoleType.base,
          ],
          name: "Calendar",
        },
      },
      {
        path: "taskiedex",
        component: TaskieDexComponent,
        canActivate: [AuthGuard],
        data: {
          authorities: [
            IRoleType.associate,
            IRoleType.superAdmin,
            IRoleType.base,
          ],
          name: "TaskieDex",
        },
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: {
          authorities: [
            IRoleType.associate,
            IRoleType.superAdmin,
            IRoleType.base,
          ],
          name: "Profile",
        },
      },
      {
        path: "taskie/:id",
        component: TaskieViewComponent,
      },
      {
        path: "home",
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: {
          name: 'Home'
        }
      },
    ],
  },
];
