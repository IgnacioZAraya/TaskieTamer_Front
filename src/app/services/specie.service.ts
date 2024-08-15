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

  getAllSignal(): Observable<ISpecie[]> {
    return this.findAll().pipe(
      tap((response: any) => {
        response.reverse();
        console.log('Species fetched:', response);
        this.specieListSignal.set(response);
      }),
      catchError((error: any) => {
        console.error("Error fetching the species", error);
        return throwError(error);
      })
    );
  }
  
  getAllSpecies() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.specieListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching specie", error);
      },
    });
  }
  
  saveSpecieWithImage(
    name: string,
    description: string,
    file: File,
    evolutionFile: File
  ): Observable<ISpecie> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('evolution', evolutionFile);

    return this.http.post<ISpecie>(this.source + '/addSpecie', formData).pipe(
      tap((response: ISpecie) => {
        this.specieListSignal.update((species) => [response, ...species]);
      }),
      catchError((error) => {
        console.error('Error saving specie', error);
        return throwError(error);
      })
    );
  }
  deleteSpecie(id: number): Observable<void> {
    return this.http.delete<void>(this.source + '/' + id).pipe(
      tap(() => {
        this.specieListSignal.update((species) =>
          species.filter((specie) => specie.id !== id)
        );
      }),
      catchError((error) => {
        console.error('Error deleting specie', error);
        return throwError(error);
      })
    );
  }
  
 
  updateSpecie(
    id: number,
    name: string,
    description: string,
    file?: File,
    evolutionFile?: File
  ): Observable<ISpecie> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }
    if (evolutionFile) {
      formData.append('evolution', evolutionFile);
    }

    return this.http.put<ISpecie>(this.source + '/' + id, formData).pipe(
      tap((updatedSpecie: ISpecie) => {
        this.specieListSignal.update((species) =>
          species.map((specie) => (specie.id === id ? updatedSpecie : specie))
        );
      }),
      catchError((error) => {
        console.error('Error updating specie', error);
        return throwError(error);
      })
    );
  }
}