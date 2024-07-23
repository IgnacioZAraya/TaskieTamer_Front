import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-xp-bar',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './xp-bar.component.html',
  styleUrl: './xp-bar.component.scss'
})
export class XpBarComponent {

  ngOnInit(): void{
    this.animatedProgressBars();
  }

  animatedProgressBars(){
    gsap.to('#mainProgressBar', {
      value: 90,
      duration: 2,
      ease: "power2.inOut"
    });
  }

}
