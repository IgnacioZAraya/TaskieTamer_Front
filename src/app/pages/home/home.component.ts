import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public isAuth: boolean;

  constructor(public router: Router, private authService : AuthService){
    this.isAuth = this.authService.check();
  }

  redRegister(){
    this.router.navigateByUrl('/register');
  }

  redLogIn() {
    this.router.navigateByUrl('/login');
  }
}
