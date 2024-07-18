import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { IUser } from "../../../interfaces";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  toastSvc = inject(ToastrService);
  public validSignup!: boolean;
  @ViewChild("name") nameModel!: NgModel;
  @ViewChild("lastname") lastnameModel!: NgModel;
  @ViewChild("email") emailModel!: NgModel;
  @ViewChild("password") passwordModel!: NgModel;

  public user: IUser = {};

  constructor(private router: Router, private authService: AuthService) {}

  redLogIn() {
    this.router.navigateByUrl("/login");
  }

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.signup(this.user).subscribe({
        next: () => (
          (this.validSignup = true),
          this.toastSvc.success(
            "You may Log In now!",
            "Registration Succesful!"
          )
        ),
        error: (err: any) => this.toastSvc.error(err.description, "Oh No!"),
      });
      this.nameModel.reset();
      this.lastnameModel.reset();
      this.emailModel.reset();
      this.passwordModel.reset();
    }
  }
}
