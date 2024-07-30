import { Component } from '@angular/core';
import { TaskListComponent } from '../../components/task/task-history-list/task-history-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [
    TaskListComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule
  ],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.scss'
})
export class TaskHistoryComponent {

}
