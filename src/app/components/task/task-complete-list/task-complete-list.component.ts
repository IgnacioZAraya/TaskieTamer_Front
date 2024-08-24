import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ITask, IUser } from '../../../interfaces';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-complete-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    MatSnackBarModule
  ],
  templateUrl: './task-complete-list.component.html',
  styleUrl: './task-complete-list.component.scss'
})
export class TaskCompleteListComponent {
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
  public currentUser: IUser = {
    email: '',
    lastname: '',
    password: '',
    name: ''
  };

  constructor() {
    this.loadTasks();
  }

  filterTask($event:Event) {
    const input = $event.target as HTMLInputElement;

    this.filteredTaskList = this.taskList.filter((task) => task.name?.toLowerCase().includes(input.value.toLowerCase())|| task.priority?.toLowerCase().includes(input.value.toLowerCase()));
  }

  loadTasks() {
    this.service.getFutureForCurrentUser();
    effect(() => {      
      this.taskList = this.service.tasks$();
      this.filteredTaskList = this.service.tasks$();
    });
  }

  showDetail(task: ITask, modal: any) {
    this.currentTask = {...task}; 
    modal.show();
  }

  completeTask(task: ITask) {
    this.service.completeTask(task.id).subscribe({
      next: () => {
        this.snackBar.open(`Task "${task.name}" completed successfully!`, 'Close', {
          duration: 3000,
        });
        this.loadTasks();
      },
      error: (error) => {
        this.snackBar.open(`Error completing task: ${error.message}`, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
