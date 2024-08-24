import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IInteractable } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InteractableService extends BaseService<IInteractable> {
  protected override source: string = "interactable";
  private interactableListSignal = signal<IInteractable[]>([]);

 

  get interactables$() {
    return this.interactableListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.interactableListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching interactables', error);
      }
    });
  }

  saveInteractableSignal(interactable: IInteractable): Observable<any> {
    return this.add(interactable).pipe(
      tap((response: any) => {
        this.interactableListSignal.update((interactables) => [response.data, ...interactables]);
      }),
      catchError((error) => {
        console.error("Error saving interactable", error);
        return throwError(error);
      })
    );
  }

  updateInteractableSignal(interactable: IInteractable): Observable<any> {
    return this.edit(interactable.id, interactable).pipe(
      tap((response: any) => {
        const updatedInteractables = this.interactableListSignal().map((i) =>
          i.id === interactable.id ? response.data : i
        );
        this.interactableListSignal.set(updatedInteractables);
      }),
      catchError((error) => {
        console.error("Error updating interactable", error);
        return throwError(error);
      })
    );
  }

  deleteInteractableSignal(interactable: IInteractable): Observable<any> {
    return this.del(interactable.id).pipe(
      tap((response: any) => {
        const updatedInteractables = this.interactableListSignal().filter(
          (i) => i.id !== interactable.id
        );
        this.interactableListSignal.set(updatedInteractables);
      }),
      catchError((error) => {
        console.error("Error deleting interactable", error);
        return throwError(error);
      })
    );
  }

 
}