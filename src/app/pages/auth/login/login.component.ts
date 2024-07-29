import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { FormsModule, NgModel } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  @ViewChild("email") emailModel!: NgModel;
  @ViewChild("password") passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: "",
    password: "",
  };

  toastSvc = inject(ToastrService);

  constructor(private router: Router, private authService: AuthService) {}

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => this.router.navigateByUrl("/app/calendar"),
        error: (err: any) =>
          this.toastSvc.error(err.error.description, "Oh No!"),
      });
    }
  }

  redRegister() {
    this.router.navigateByUrl("/register");
  }
}
