import { Injectable, signal } from '@angular/core';
import { ILevel } from '../interfaces';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserLevelService extends BaseService<ILevel> {
  protected override source: string = "level";
  private userLevelListSignal = signal<ILevel[]>([]);

  get userLevels$() {
    return this.userLevelListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.userLevelListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching user levels', error);
      }
    });
  }

  saveUserLevelSignal(userLvl: ILevel): Observable<any> {
    return this.add(userLvl).pipe(
      tap((response: any) => {
        this.userLevelListSignal.update((userLevels) => [response, ...userLevels]);
      }),
      catchError((error) => {
        console.error("Error saving user level", error);
        return throwError(error);
      })
    );
  }

  updateUserLevelSignal(userLvl: ILevel): Observable<any> {
    return this.edit(userLvl.id, userLvl).pipe(
      tap((response: any) => {
        const updatedUserLvls = this.userLevelListSignal().map((ul) =>
          ul.id === userLvl.id ? response : ul
        );
        this.userLevelListSignal.set(updatedUserLvls);
      }),
      catchError((error) => {
        console.error("Error updating user level", error);
        return throwError(error);
      })
    );
  }

  deleteUserLevelSignal(userLvl: ILevel): Observable<any> {
    return this.del(userLvl.id).pipe(
      tap((response: any) => {
        const updatedUserLvls = this.userLevelListSignal().filter(
          (ul) => ul.id !== userLvl.id
        );
        this.userLevelListSignal.set(updatedUserLvls);
      }),
      catchError((error) => {
        console.error("Error deleting user level", error);
        return throwError(error);
      })
    );
  }
}
