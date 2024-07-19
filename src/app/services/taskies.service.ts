import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { ITaskie } from "../interfaces";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
  })

  export class TaskieService {
    private taskies: ITaskie[] = [
        { id: 1, specie: 'Lobo', name: 'Lobito', experience: '1000', sprite: 'assets/taskies/Lobo bb.png', unlock: true, cosmetic: 'Cosmetic 1'},
        { id: 2, specie: 'Cocodrilo', name: 'Croco', experience: '2000', sprite: 'assets/taskies/Croco bb.png', unlock: true, cosmetic: 'Cosmetic 1'},
        { id: 3, specie: 'Ajolote', name: 'Axolt', experience: '1500', sprite: 'assets/taskies/Ajolote bb.png', unlock: true, cosmetic: 'Cosmetic 1'},
    ];

    getTaskies(): Observable<ITaskie[]>{
        return of (this.taskies);

    }

    getTaskieByID(id:number): Observable<ITaskie | undefined> {
        return of (this.taskies.find(taskies => taskies.id === id))

    }
  }