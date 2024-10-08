

import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";

import { ICosmetic, IInteractable, ITaskie, ITaskieImg, ITaskieSpec} from "../interfaces";

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
  constructor() {
    super();
    this.startPeriodicUpdate();
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        
        this.taskieListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching taskies", error);
      },
    });
  }

  saveTaskieSignal(taskie: ITaskieSpec): Observable<any> {
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
 
  getCosmeticsForTaskie(taskieId: number): Observable<ICosmetic[]> {
    return this.http.get<ICosmetic[]>(this.source + '/' + taskieId + '/cosmetics');
}

  applyInteractable(taskieId: number, cosmeticId: number): Observable<ITaskie> {
    const requestPayload = { cosmeticId: cosmeticId };
    return this.http.put<ITaskie>(this.source+ '/' + taskieId + '/apply-interactable', requestPayload).pipe(
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

  startPeriodicUpdate() {
    setInterval(() => {
      this.getAllSignal();
    }, 1000); 
  }
}
