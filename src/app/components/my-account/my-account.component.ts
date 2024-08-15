import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "./../../services/profile.service";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [],
  templateUrl: "./my-account.component.html",
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent implements OnInit {
  public userName: string = ""; //Nombre de usuario
  private service = inject(AuthService);
  public profileService = inject(ProfileService);

  constructor(public router: Router) {
    this.profileService.getLoggedUserInfo();
  }

  ngOnInit() {}

  profile() {
    this.router.navigateByUrl("/app/profile");
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl("/home");
  }
}
