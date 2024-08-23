import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { IFeedBackMessage, IUser, IUserSpec } from "../../../interfaces";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent {
  @Input() title!: string;
  @Input() auxUser: IUser = {
    email: "",
    lastname: "",
    password: "",
    name: "",
  };
  @Input() userSpec: IUserSpec = {
    email: "",
    lastname: "",
    password: "",
    name: "",
  };

  @Input() action: string = "add";
  service = inject(UserService);
  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  toastSvc = inject(ToastrService);

  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.setUserUpdt();

      switch(this.action){
        case "profileEdit" : {
          this.service.updateUserProfileSignal(this.userSpec).subscribe({
            next: () => {
              this.feedbackMessage.message = `User successfully ${
                this.action == "add" ? "added" : "updated"
              }`;
              this.toastSvc.success(this.feedbackMessage.message, "SUCCES!!!");
            },
            error: (error: any) => {
              this.feedbackMessage.message = error.message;
              this.toastSvc.error(this.feedbackMessage.message, "OH NO!");
            },
          });
          break;
        }
        case "kidMode": {
          this.service.updateKidStatusSignal(this.userSpec).subscribe({
            next: () => {
              this.feedbackMessage.message = `User successfully ${
                this.action == "add" ? "added" : "updated"
              }`;
              this.toastSvc.success(this.feedbackMessage.message, "SUCCES!!!");
            },
            error: (error: any) => {
              this.feedbackMessage.message = error.message;
              this.toastSvc.error(this.feedbackMessage.message, "OH NO!");
            },
          });
          break;
        }

        default : {
          this.service[
            this.action == "add" ? "saveUserSignal" : "updateUserSignal"
          ](this.userSpec).subscribe({
            next: () => {
              this.feedbackMessage.message = `User successfully ${
                this.action == "add" ? "added" : "updated"
              }`;
              this.toastSvc.success(this.feedbackMessage.message, "SUCCES!!!");
            },
            error: (error: any) => {
              this.feedbackMessage.message = error.message;
              this.toastSvc.error(this.feedbackMessage.message, "OH NO!");
            },
          });
          break;
        }
      }
    }
  }

  private setUserUpdt(): void {
    this.userSpec.id = this.auxUser.id;
    this.userSpec.name = this.auxUser.name;
    this.userSpec.lastname = this.auxUser.lastname;
    if (this.action == "add") {
      this.userSpec.password = this.auxUser.password;
    }
    this.userSpec.email = this.auxUser.email;
  }
}
