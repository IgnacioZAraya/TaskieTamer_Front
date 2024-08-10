import { UserService } from "./../../services/user.service";
import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { IFeedBackMessage, IUser, IUserSpec } from "../../interfaces";

@Component({
  selector: "app-code-checker",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./code-checker.component.html",
  styleUrl: "./code-checker.component.scss",
})
export class CodeCheckerComponent {
  
  toastSvc = inject(ToastrService);
  userService = inject(UserService);

  @Input() title!: string;
  @Input() action!: string;
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
    name: ""
  };

  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  public privateCode : number = 0;

  handleAction(form: NgForm) {

    this.setUserUpdt();

    console.log(this.userSpec.privateCode);

    this.userService.updateAssociateUserSignal(this.userSpec).subscribe({
      next: () => {
        this.feedbackMessage.message = `Role has changed successfully`;
        this.toastSvc.success(this.feedbackMessage.message, "SUCCES!!!");
      },
      error: (error: any) => {
        this.feedbackMessage.message = error.message;
        this.toastSvc.error(this.feedbackMessage.message, "Oh no!");
      },
    });
  }

  private setUserUpdt(): void {
    this.userSpec.id = this.auxUser.id;
    this.userSpec.name = this.auxUser.name;
    this.userSpec.lastname = this.auxUser.lastname;
    this.userSpec.password = this.auxUser.password;
    this.userSpec.email = this.auxUser.email;
  }
}
