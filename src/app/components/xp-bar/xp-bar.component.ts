import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


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
  public progressPercentage!: string;

  public experience: number = 1250;
  public valueLevel: number = 2500;

  constructor() {
    this.percentageCalc(this.experience, this.valueLevel);
  }

  private percentageCalc(dividend: number, divisor: number) : void{
    let percentage = (dividend/divisor)*100;

    this.progressPercentage = percentage.toString()+"%";
  }
}
