import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { ITaskie } from "../interfaces";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
  })

  export class TaskieService extends BaseService<ITaskie> {
    protected override source: string = 'taskie';
    private taskieListSignal = signal<ITaskie[]>([]);

    get taskies$(){
        return this.taskieListSignal;
    }
    getAllSignal(){
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                console.log('Taskies fetched:', response);
                this.taskieListSignal.set(response);
            }
        })
    }
   
  }