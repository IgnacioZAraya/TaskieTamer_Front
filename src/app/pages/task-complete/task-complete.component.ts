import { Component } from '@angular/core';
import { TaskCompleteListComponent } from '../../components/task/task-complete-list/task-complete-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-completion',
  standalone: true,
  imports: [
    TaskCompleteListComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule
  ],
  templateUrl: './task-complete.component.html',
  styleUrl: './task-complete.component.scss'
})
export class TaskCompleteComponent {
}
