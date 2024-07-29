import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { ICosmetic } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CosmeticService extends BaseService<ICosmetic> {
  protected override source: string = "cosmetic";
  private cosmeticListSignal = signal<ICosmetic[]>([]);

 

  get cosmetics$() {
    return this.cosmeticListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        console.log('Cosmetics fetched:', response);
        this.cosmeticListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching cosmetics', error);
      }
    });
  }

  saveCosmeticSignal(cosmetic: ICosmetic): Observable<any> {
    return this.add(cosmetic).pipe(
      tap((response: any) => {
        this.cosmeticListSignal.update((cosmetics) => [response.data, ...cosmetics]);
      }),
      catchError((error) => {
        console.error("Error saving cosmetic", error);
        return throwError(error);
      })
    );
  }

  updateCosmeticSignal(cosmetic: ICosmetic): Observable<any> {
    return this.edit(cosmetic.id, cosmetic).pipe(
      tap((response: any) => {
        const updatedCosmetics = this.cosmeticListSignal().map((c) =>
          c.id === cosmetic.id ? response.data : c
        );
        this.cosmeticListSignal.set(updatedCosmetics);
      }),
      catchError((error) => {
        console.error("Error updating cosmetic", error);
        return throwError(error);
      })
    );
  }

  deleteCosmeticSignal(cosmetic: ICosmetic): Observable<any> {
    return this.del(cosmetic.id).pipe(
      tap((response: any) => {
        const updatedCosmetics = this.cosmeticListSignal().filter(
          (c) => c.id !== cosmetic.id
        );
        this.cosmeticListSignal.set(updatedCosmetics);
      }),
      catchError((error) => {
        console.error("Error deleting cosmetic", error);
        return throwError(error);
      })
    );
  }

 
}