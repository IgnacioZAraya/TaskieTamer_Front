import { Component } from '@angular/core';
import { TaskVerifyListComponent } from '../../components/task/task-verify-list/task-verify-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-verify',
  standalone: true,
  imports: [
    TaskVerifyListComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule
  ],
  templateUrl: './task-verify.component.html',
  styleUrl: './task-verify.component.scss'
})
export class TaskVerifyComponent {
}
