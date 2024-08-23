import { Component } from '@angular/core';
import { TaskNextListComponent } from '../../components/task/task-next-list/task-next-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [
    TaskNextListComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule
  ],
  templateUrl: './task-next.component.html',
  styleUrl: './task-next.component.scss'
})
export class TaskNextComponent {

}
