import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ITask } from '../../interfaces';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  public search: String = '';
  public taskList: ITask[] = [];
  private service = inject(TaskService);
  private snackBar = inject(MatSnackBar);
  public currentTask: ITask = {
    name: '',
    priority: '',
    startDate: new Date(),
    endDate: new Date(),
    description: '',
  };

  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    this.service.getTasksForCurrentUser();
    effect(() => {      
      this.taskList = this.service.tasks$();
    });
  }

  showDetail(task: ITask, modal: any) {
    this.currentTask = {...task}; 
    modal.show();
  }
}
