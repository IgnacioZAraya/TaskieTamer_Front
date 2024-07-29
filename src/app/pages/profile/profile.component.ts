import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { XpBarComponent } from "../../components/xp-bar/xp-bar.component";
import { IUser } from "../../interfaces";
import { ProfileService } from "./../../services/profile.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    XpBarComponent,
    UserFormComponent,
    LoaderComponent,
    ModalComponent,],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  public profileService = inject(ProfileService);

  public user!: IUser;

  constructor() {
    this.profileService.getLoggedUserInfo();
  }
  
  public level() {
    
    this.profileService.user$().level?.value;
  }
}
