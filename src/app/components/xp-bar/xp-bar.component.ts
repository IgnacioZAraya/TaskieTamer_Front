import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { IUser } from '../../interfaces';


@Component({
  selector: 'app-xp-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './xp-bar.component.html',
  styleUrl: './xp-bar.component.scss'
})
export class XpBarComponent {
  public profileService = inject(ProfileService);
  public progressPercentage!: string;

  
  constructor() {
    this.profileService.getLoggedUserInfo();

    setTimeout(() => {
      const user = this.profileService.user$();
      const experience = user?.experience ?? 0;
      const valueLevel = user?.level?.value ?? 1; 

      this.percentageCalc(experience, valueLevel);
    }, 100); 
  }


  private percentageCalc(dividend: number, divisor: number) : void{
    let percentage = (dividend/divisor)*100;

    this.progressPercentage = percentage.toString()+"%";
  }
}