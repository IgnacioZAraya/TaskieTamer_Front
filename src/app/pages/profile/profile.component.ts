import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { XpBarComponent } from "../../components/xp-bar/xp-bar.component";
import { IRoleType, IUser } from "../../interfaces";
import { ProfileService } from "./../../services/profile.service";
import { CodeCheckerComponent } from "../../components/code-checker/code-checker.component";
import { EmailService } from "../../services/email.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    XpBarComponent,
    UserFormComponent,
    CodeCheckerComponent,
    LoaderComponent,
    ModalComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  toastSvc = inject(ToastrService);
  public profileService = inject(ProfileService);
  public authService = inject(AuthService);

  public user!: IUser;
  public isParent!: boolean;
  public code!: number;
  public name!: string | undefined;

  constructor(private emailService: EmailService) {
    this.profileService.getLoggedUserInfo();
    this.isParent = this.checkUserAssociate();
    this.name = this.profileService.user$().name;
    this.code = this.randomCode();
  }

  public level() {
    this.profileService.user$().level?.value;
  }

  sendEmail(): void {
    const to = this.profileService.user$().email;
    const subject = "Testing SendGrid API";
    const content = `
      <html>
      <body>
        <h1>Hello ${this.name}!</h1>
        <p>Here's your code to change your account role!</p>
        <p>${this.code}</p>
      </body>
      </html>
    `;

    this.emailService
      .sendEmail(to, subject, content)
      .then(() => {
        this.toastSvc.success("Email was sent to: ", this.profileService.user$().email);
      })
      .catch((error) => {
        this.toastSvc.error("Error sending email: ", error);
      });
  }

  randomCode(): number {
    return Math.floor(Math.random() * 900000 + 100000);
  }

  checkUserAssociate(): boolean{
    if (this.authService.hasRole(IRoleType.associate) && this.profileService.user$().parentActive){
      return true;
    }

    return false;
  }
}
