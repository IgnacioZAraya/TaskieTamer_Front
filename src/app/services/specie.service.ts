

import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { ISpecie } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SpecieService extends BaseService<ISpecie> {
  protected override source: string = 'specie';
  private specieListSignal = signal<ISpecie[]>([]);

  

  get species$() {
    return this.specieListSignal;
  }
  constructor() {
    super();
    
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        console.log('Species fetched:', response);
        this.specieListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching the species", error);
      },
    });
  }
 
  
  saveSpecieWithImage(
    name: string,
    description: string,
    file: File
  ): Observable<ISpecie> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    return this.http.post<ISpecie>(this.source + '/addSpecie' , formData).pipe(
      tap((response: ISpecie) => {
        this.specieListSignal.update((species) => [response, ...species]);
      }),
      catchError((error) => {
        console.error('Error saving specie', error);
        return throwError(error);
      })
    );
  }
  updateSpecieSignal(specie: ISpecie): Observable<any> {
    return this.edit(specie.id, specie).pipe(
      tap((response: any) => {
        const updatedSpecies = this.specieListSignal().map((s) =>
          s.id === specie.id ? response : s
        );
        this.specieListSignal.set(updatedSpecies);
      }),
      catchError((error) => {
        console.error("Error updating taskie", error);
        return throwError(error);
      })
    );
  }

  deleteSpecieSignal(specie: ISpecie): Observable<any> {
    return this.del(specie.id).pipe(
      tap((response: any) => {
        const updatedSpecies = this.specieListSignal().filter(
          (s) => s.id !== specie.id
        );
        this.specieListSignal.set(updatedSpecies);
      }),
      catchError((error) => {
        console.error("Error deleting taskie", error);
        return throwError(error);
      })
    );
  }
 


}
