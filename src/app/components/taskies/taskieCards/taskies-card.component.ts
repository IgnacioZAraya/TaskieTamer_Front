import { Component, Input, inject } from '@angular/core';
import { IFeedBackMessage, IUser, IFeedbackStatus, ITaskieImg} from '../../../interfaces';
import { NgOptimizedImage, NgFor  } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';
@Component({
    selector: "app-taskie-card",
    standalone: true,
    imports: [NgOptimizedImage,
        NgFor
     ],
    templateUrl: "./taskies-card.component.html",
    styleUrls: ["./taskies-card.component.scss"]
  })
  export class TaskieCardComponent{
    images: ITaskieImg[] = [
        { src: '../../../assets/taskies/Ajolote bb.png', alt: 'Ajolote_bb', title: 'Ajolotito' },
        { src: '../../../assets/taskies/Croco bb.png', alt: 'Croco bb', title: 'Cocodrilito' },
        { src: '../../../assets/taskies/Lobo bb.png', alt: 'Lobo bb', title: 'Lobito' },
      
      ];
    
      onImageClick(image: ITaskieImg) {
        console.log('Image clicked:', image);
  }
}