import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IUser, IUserSpec } from "../interfaces";
import { Observable, catchError, tap, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService extends BaseService<IUser> {
  protected override source: string = "users";
  private userListSignal = signal<IUser[]>([]);
  get users$() {
    return this.userListSignal;
  }
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.userListSignal.set(response);
      },
      error: (error: any) => {
        console.error("Error fetching users", error);
      },
    });
  }
  saveUserSignal(user: IUser): Observable<any> {
    return this.add(user).pipe(
      tap((response: any) => {
        this.userListSignal.update((users) => [response, ...users]);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  saveEmailDataSignal(user: IUserSpec): Observable<any> {
    return this.emailData(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map((u) =>
          u.id === user.id ? response : u
        );
        this.userListSignal.set(updatedUsers);
        return response;
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  updateUserSignal(user: IUserSpec): Observable<any> {
    return this.edit(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map((u) =>
          u.id === user.id ? response : u
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  updateUserProfileSignal(user: IUserSpec): Observable<any> {
    return this.editProfile(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map((u) =>
          u.id === user.id ? response : u
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  updateKidStatusSignal(user: IUserSpec): Observable<any> {
    return this.editKidStats(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map((u) =>
          u.id === user.id ? response : u
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  updateAssociateUserSignal(user: IUserSpec): Observable<any> {
    return this.editAssociate(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map((u) =>
          u.id === user.id ? response : u
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }

  deleteUserSignal(user: IUser): Observable<any> {
    return this.del(user.id).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().filter(
          (u) => u.id !== user.id
        );
        this.userListSignal.set(updatedUsers);
      }),
      catchError((error) => {
        console.error("Error saving user", error);
        return throwError(error);
      })
    );
  }
}
