import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITask, ITaskSpec } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<ITask>{
  protected override source: string = 'task';
  private taskListSignal = signal<ITask[]>([]);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  get tasks$ () {
    return this.taskListSignal;
  }

  public getAll() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.taskListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error in get all tasks request', error);
        this.snackBar.open(error.error.description, 'Close' , {
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
      })
    );
  }

  public delete(task: ITask) {
    this.del(task.id).subscribe({
      next: () => {
        this.taskListSignal.set(this.taskListSignal().filter(task => task.id != task.id));
      },
      error: (error: any) => {
        console.error('response', error.description);
        this.snackBar.open(error.error.description, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
