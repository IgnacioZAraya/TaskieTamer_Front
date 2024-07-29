import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IUser } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = "users/currentUser";
  private userSignal = signal<IUser>({});

  get user$() {
    return this.userSignal;
  }

  getLoggedUserInfo() {
    this.findAll().subscribe({
      next: (response: any) => {
        this.userSignal.set(response);
      },
    });
  }
}
