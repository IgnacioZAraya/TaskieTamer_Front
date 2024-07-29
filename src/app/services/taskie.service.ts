import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { ICosmetic, ITaskie } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class TaskieService extends BaseService<ITaskie> {
  protected override source: string = 'taskie';
  private taskieListSignal = signal<ITaskie[]>([]);

  get taskies$() {
    return this.taskieListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        console.log('Taskies fetched:', response);
        this.taskieListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching taskies", error);
      },
    });
  }

  saveTaskieSignal(taskie: ITaskie): Observable<any> {
    return this.add(taskie).pipe(
      tap((response: any) => {
        this.taskieListSignal.update((taskies) => [response, ...taskies]);
      }),
      catchError((error) => {
        console.error("Error saving taskie", error);
        return throwError(error);
      })
    );
  }

  updateTaskieSignal(taskie: ITaskie): Observable<any> {
    return this.edit(taskie.id, taskie).pipe(
      tap((response: any) => {
        const updatedTaskies = this.taskieListSignal().map((t) =>
          t.id === taskie.id ? response : t
        );
        this.taskieListSignal.set(updatedTaskies);
      }),
      catchError((error) => {
        console.error("Error updating taskie", error);
        return throwError(error);
      })
    );
  }

  deleteTaskieSignal(taskie: ITaskie): Observable<any> {
    return this.del(taskie.id).pipe(
      tap((response: any) => {
        const updatedTaskies = this.taskieListSignal().filter(
          (t) => t.id !== taskie.id
        );
        this.taskieListSignal.set(updatedTaskies);
      }),
      catchError((error) => {
        console.error("Error deleting taskie", error);
        return throwError(error);
      })
    );
  }
 
  applyCosmetic(taskieId: number, cosmeticId: number): Observable<ITaskie> {
    const requestPayload = { cosmeticId: cosmeticId };
    return this.http.put<ITaskie>(this.source+ '/' + taskieId + '/apply-cosmetic', requestPayload).pipe(
      tap((updatedTaskie: ITaskie) => {
        this.taskieListSignal.update((taskies) => {
          const index = taskies.findIndex((m: ITaskie) => m.id === taskieId);
          if (index !== -1) {
            taskies[index] = updatedTaskie;
          } else {
            taskies.push(updatedTaskie);
          }
          return taskies;
        });
      }),
      catchError((error) => {
        console.error('Error applying cosmetic to taskie', error);
        return throwError(error);
      })
    );
  }
}
