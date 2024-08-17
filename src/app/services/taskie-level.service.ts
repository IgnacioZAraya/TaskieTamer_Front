
import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITaskieLevel } from '../interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskieLevelService extends BaseService<ITaskieLevel> {
  protected override source: string = "levelTaskie";
  private taskieLevelListSignal = signal<ITaskieLevel[]>([]);

  get taskieLevels$() {
    return this.taskieLevelListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.taskieLevelListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching taskie levels', error);
      }
    });
  }

  saveTaskieLevelSignal(taskieLvl: ITaskieLevel): Observable<any> {
    return this.add(taskieLvl).pipe(
      tap((response: any) => {
        this.taskieLevelListSignal.update((taskieLevels) => [response, ...taskieLevels]);
      }),
      catchError((error) => {
        console.error("Error saving taskie level", error);
        return throwError(error);
      })
    );
  }

  updateTaskieLevelSignal(taskieLvl: ITaskieLevel): Observable<any> {
    return this.edit(taskieLvl.id, taskieLvl).pipe(
      tap((response: any) => {
        const updatedTaskieLvls = this.taskieLevelListSignal().map((tl) =>
          tl.id === taskieLvl.id ? response : tl
        );
        this.taskieLevelListSignal.set(updatedTaskieLvls);
      }),
      catchError((error) => {
        console.error("Error updating taskie level", error);
        return throwError(error);
      })
    );
  }

  deleteTaskieLevelSignal(taskieLvl: ITaskieLevel): Observable<any> {
    return this.del(taskieLvl.id).pipe(
      tap((response: any) => {
        const updatedTaskieLvls = this.taskieLevelListSignal().filter(
          (tl) => tl.id !== taskieLvl.id
        );
        this.taskieLevelListSignal.set(updatedTaskieLvls);
      }),
      catchError((error) => {
        console.error("Error deleting taskie level", error);
        return throwError(error);
      })
    );
  }
}
