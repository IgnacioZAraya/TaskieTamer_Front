import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITask, ITaskSpec } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<ITask> {
  protected override source: string = 'task';
  private taskListSignal = signal<ITask[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private authService: AuthService = inject(AuthService);

  get tasks$() {
    return this.taskListSignal;
  }

  public getTasksForCurrentUser() {
    const userId = this.authService.getUser()?.id;
    if (userId) {
      this.findByUserId(userId).subscribe({
        next: (response: any) => {
          response.reverse();
          this.taskListSignal.set(response);
        },
        error: (error: any) => {
          console.error('Error in get tasks for current user request', error);
          this.snackBar.open(error.error.description, 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.error('User ID is not defined');
      this.snackBar.open('User ID is not defined', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  public getHistoryForCurrentUser() {
    const userId = this.authService.getUser()?.id;
    if (userId) {
      this.findHistory(userId).subscribe({
        next: (response: any) => {
          response.reverse();
          this.taskListSignal.set(response);
        },
        error: (error: any) => {
          console.error('Error in get tasks for current user request', error);
          this.snackBar.open(error.error.description, 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.error('User ID is not defined');
      this.snackBar.open('User ID is not defined', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  public getNextTaskForCurrentUser() {
    const userId = this.authService.getUser()?.id;
    if (userId) {
      this.findNext(userId).subscribe({
        next: (response: any) => {
          response.reverse();
          this.taskListSignal.set(response);
        },
        error: (error: any) => {
          console.error('Error in get tasks for current user request', error);
          this.snackBar.open(error.error.description, 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      console.error('User ID is not defined');
      this.snackBar.open('User ID is not defined', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }


  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.taskListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all tasks request', error);
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  saveTaskSignal(task: ITask): Observable<any> {
    return this.add(task).pipe(
      tap((response: any) => {
        this.taskListSignal.update((tasks) => [response, ...tasks]);
      }),
      catchError((error) => {
        console.error("Error saving task", error);
        return throwError(error);
      }),
      finalize(() => {
        this.getTasksForCurrentUser();
      })
    );
  }

  updateTaskSignal(task: ITaskSpec): Observable<any> {
    return this.edit(task.id, task).pipe(
      tap((response: any) => {
        const updatedTasks = this.taskListSignal().map((u) =>
          u.id === task.id ? response : u
        );
        this.taskListSignal.set(updatedTasks);
      }),
      catchError((error) => {
        console.error("Error saving task", error);
        return throwError(error);
      }),
      finalize(() => {
        this.getTasksForCurrentUser();
      })
    );
  }

  deleteTaskSignal(task: ITask): Observable<any> {
    return this.del(task.id).pipe(
      tap((response: any) => {
        const updatedTasks = this.taskListSignal().filter(t => t.id !== task.id);
        this.taskListSignal.set(updatedTasks);
      }),
      catchError((error) => {
        console.error("Error deleting task", error);
        return throwError(error);
      }),
      finalize(() => {
        this.getTasksForCurrentUser();
      })
    );
  }
}