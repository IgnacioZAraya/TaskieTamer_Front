import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITask } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  public save(task: ITask) {
    this.add(task).subscribe(
      (response: any) => {
        this.taskListSignal.update((tasks: ITask[]) => [response, ...tasks]);
      },
      (error: any) => {
        console.error('Error adding task:', error);
        const errorMessage = error.error?.description || 'Unknown error';
        this.snackBar.open(errorMessage, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  public update(task: ITask) {
    this.add(task).subscribe({
      next: (response: any) => {
        const updatedItems = this.taskListSignal().map(task =>
          task.id === task.id ? response : task
        );
        this.taskListSignal.set(updatedItems);
      },
      error: (error: any) => {
        console.error('Error updating task:', error);
        const errorMessage = error.error?.description || 'Unknown error';
        this.snackBar.open(errorMessage, 'Close' , {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
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