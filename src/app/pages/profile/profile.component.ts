import { ProfileService } from "./../../services/profile.service";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { XpBarComponent } from "../../components/xp-bar/xp-bar.component";
import { IUser } from "../../interfaces";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, XpBarComponent],
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
