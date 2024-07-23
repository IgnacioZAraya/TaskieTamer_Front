import { Component, Input, input } from '@angular/core';
import { TaskieCardComponent } from '../../components/taskies/taskieCards/taskies-card.component'; 
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { TaskieDetailComponent } from '../../components/taskies/taskiesProf/taskie-prof.component';


@Component({
  selector: 'app-taskies',
  standalone: true,
  imports: [
    TaskieCardComponent,
    TaskieDetailComponent,
    LoaderComponent,
    ModalComponent
  ],
  templateUrl: './taskie.component.html',
  styleUrl: './taskie.component.scss'
})
export class TaskieComponent {


}