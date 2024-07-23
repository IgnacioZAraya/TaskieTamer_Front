import { Component } from '@angular/core';
import { TaskieCardComponent } from '../../components/taskies/taskieCards/taskies-card.component'; 
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-taskies',
  standalone: true,
  imports: [
    
    TaskieCardComponent,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './taskiescard.component.html',
  styleUrl: './taskiecard.component.scss'
})
export class TaskieComponent {

}