import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../../../interfaces';
import { AuthService } from '../../../../services/auth.service';
import { LayoutService } from '../../../../services/layout.service';
import { MyAccountComponent } from '../../../my-account/my-account.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MyAccountComponent],
  templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  public user?: IUser;

  constructor(
    public router: Router,
    public layoutService: LayoutService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  public profile(): void {
    this.router.navigateByUrl('/profile');
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/home');
  }
}
