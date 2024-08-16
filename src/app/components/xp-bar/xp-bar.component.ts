import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-xp-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './xp-bar.component.html',
  styleUrls: ['./xp-bar.component.scss']
})
export class XpBarComponent {
  private profileService = inject(ProfileService);
  public progressPercentage!: string;

  constructor() {
    effect(() => {
      const user = this.profileService.user$();
      const experience = user?.experience ?? 0;
      const valueLevel = user?.level?.value ?? 1;

      this.percentageCalc(experience, valueLevel);
    });
  }

  private percentageCalc(dividend: number, divisor: number): void {
    const percentage = (dividend / divisor) * 100;
    this.progressPercentage = percentage.toFixed(2) + "%";
  }
}