import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IStatus } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StatusService extends BaseService<IStatus> {
  protected override source: string = 'status';
  private statusListSignal = signal<IStatus[]>([]);

  get status$() {
    return this.statusListSignal;
  }

  constructor() {
    super();
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.statusListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching status", error);
      },
    });
  }

  saveStatusSignal(statu: IStatus): Observable<any> {
    return this.add(statu).pipe(
      tap((response: any) => {
        this.statusListSignal.update((status) => [response, ...status]);
      }),
      catchError((error) => {
        console.error("Error saving status", error);
        return throwError(error);
      })
    );
  }

  updateStatusSignal(statu: IStatus): Observable<any> {
    return this.edit(statu.id, statu).pipe(
      tap((response: any) => {
        const updatedStatus = this.statusListSignal().map((t) =>
          t.id === statu.id ? response : t
        );
        this.statusListSignal.set(updatedStatus);
      }),
      catchError((error) => {
        console.error("Error updating status", error);
        return throwError(error);
      })
    );
  }

  deleteStatusSignal(statu: IStatus): Observable<any> {
    return this.del(statu.id).pipe(
      tap((response: any) => {
        const updatedStatus = this.statusListSignal().filter(
          (t) => t.id !== statu.id
        );
        this.statusListSignal.set(updatedStatus);
      }),
      catchError((error) => {
        console.error("Error deleting status", error);
        return throwError(error);
      })
    );
  }


  getStatusById(id: number): Observable<IStatus> {
    return this.find(id).pipe(
      tap((response: any) => response.data), 
      catchError((error) => {
        console.error("Error fetching status with ID " + id, error);
        return throwError(error);
      })
    );
  }

 
   getDefaultStatus(): Observable<IStatus> {
    const defaultStatusId = 1; 
    return this.getStatusById(defaultStatusId);
  }

}