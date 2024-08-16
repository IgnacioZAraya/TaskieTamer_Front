import { UserService } from "./../../services/user.service";
import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { XpBarComponent } from "../../components/xp-bar/xp-bar.component";
import {
  IFeedBackMessage,
  IRoleType,
  IUser,
  IUserSpec,
} from "../../interfaces";
import { ProfileService } from "./../../services/profile.service";
import { CodeCheckerComponent } from "../../components/code-checker/code-checker.component";
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
  public user!: IUser;
  public UserService = inject(UserService);
  public authService = inject(AuthService);

  public userSpec: IUserSpec = {
    email: "",
    lastname: "",
    password: "",
    name: "",
  };
  public isKid!: boolean;
  public isAssociate!: boolean;
  public code!: number;
  public name!: string | undefined;
  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  constructor() {
    this.profileService.getLoggedUserInfo();
    this.isAssociate = this.authService.hasRole(IRoleType.associate);
    this.isKid = this.checkUserAssociate();
  }

  ngOnInit(): void {
    this.profileService.getLoggedUserInfo(); 
  }

  public level() {
    this.profileService.user$().level?.value;
  }

  sendEmail(): void {
    this.setUserUpdt();

    this.UserService.saveEmailDataSignal(this.userSpec).subscribe({
      next: () => {
        this.feedbackMessage.message = `Email sent successfuly`;
        this.toastSvc.success(this.feedbackMessage.message, "SUCCES!!!");
      },
      error: (error: any) => {
        this.feedbackMessage.message = error.message;
        this.toastSvc.error(this.feedbackMessage.message, "Email wasn't sent!");
      },
    });
  }

  checkUserAssociate(): boolean {
    if (
      this.authService.hasRole(IRoleType.associate) &&
      this.profileService.user$().isKid
    ) {
      return true;
    }

    return false;
  }

  private setUserUpdt(): void {
    console.log(this.authService.getUser()?.id);

    this.userSpec.id = this.authService.getUser()?.id;
    this.userSpec.name = this.authService.getUser()?.name;
    this.userSpec.lastname = this.authService.getUser()?.lastname;
    this.userSpec.password = this.authService.getUser()?.password;
    this.userSpec.email = this.authService.getUser()?.email;
  }
}
