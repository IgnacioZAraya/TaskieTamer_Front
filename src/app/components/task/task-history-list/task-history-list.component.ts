import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ITask } from '../../../interfaces';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule
  ],
  templateUrl: './task-history-list.component.html',
  styleUrl: './task-history-list.component.scss'
})
export class TaskListComponent {
  public search: String = '';
  public taskList: ITask[] = [];
  public filteredTaskList: ITask[] = [];
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

  filterTask($event:Event) {
    const input = $event.target as HTMLInputElement;

    this.filteredTaskList = this.taskList.filter((task) => task.name?.toLowerCase().includes(input.value.toLowerCase())|| task.priority?.toLowerCase().includes(input.value.toLowerCase()));
  }

  loadTasks() {
    this.service.getHistoryForCurrentUser();
    effect(() => {      
      this.taskList = this.service.tasks$();
      this.filteredTaskList = this.service.tasks$();
    });
  }

  

  showDetail(task: ITask, modal: any) {
    this.currentTask = {...task}; 
    modal.show();
  }
}
