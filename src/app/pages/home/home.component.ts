import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(public router: Router){

  }

  redRegister(){
    this.router.navigateByUrl('/register');
  }

  redLogIn() {
    this.router.navigateByUrl('/login');
  }
}
