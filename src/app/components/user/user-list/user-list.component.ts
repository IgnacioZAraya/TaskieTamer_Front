import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IUser } from '../../../interfaces';
import { UserService } from '../../../services/user.service';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-from/user-form.component';


@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    UserFormComponent,
    ConfirmationComponent,
    MatSnackBarModule
  ],
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.scss",
})
export class UserListComponent {
  public search: String = "";
  public userList: IUser[] = [];
  private service = inject(UserService);
  public currentUser: IUser = {
    email: "",
    lastname: "",
    password: "",
    name: "",
  };

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.userList = this.service.users$();
    });
  }

  showDetail(user: IUser, modal: any) {
    this.currentUser = { ...user };
    modal.show();
  }

  showConfirmation(user: IUser, modal: any) {
    this.currentUser = {...user}; 
    modal.show();
  }
}
