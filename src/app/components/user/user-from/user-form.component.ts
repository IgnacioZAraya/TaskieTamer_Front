import { Component, Input, inject } from "@angular/core";
import { IFeedBackMessage, IUser, IFeedbackStatus } from "../../../interfaces";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../../../services/user.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-form.component.html",
  styleUrl: "./user-form.component.scss",
})
export class UserFormComponent {
  @Input() title!: string;
  @Input() user: IUser = {
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
      this.service[
        this.action == "add" ? "saveUserSignal" : "updateUserSignal"
      ](this.user).subscribe({
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
    }
  }
}
