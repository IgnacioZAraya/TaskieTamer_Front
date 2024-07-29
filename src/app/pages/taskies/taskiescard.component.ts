import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { TaskieViewComponent } from '../../components/taskies/taskieCards/taskies-card.component'; 
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { TaskieDexComponent } from '../../components/taskies/taskieDex/taskiesDex.component';
import { CommonModule } from '@angular/common';
import { TaskieService } from '../../services/taskie.service';
import { ITaskie } from '../../interfaces';

@Component({
  selector: 'app-taskies',
  standalone: true ,
  imports: [
    CommonModule,

    TaskieViewComponent,
    LoaderComponent,
    ModalComponent
],
  templateUrl: './taskiescard.component.html',
  styleUrl: './taskiecard.component.scss'
})
export class TaskieComponent implements OnInit {
  taskies: ITaskie[] = [];
  private injector = inject(Injector);

  constructor(private taskieService: TaskieService) {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.taskies = this.taskieService.taskies$();
        console.log('Taskies loaded:', this.taskies);
      });
    });
  }

  ngOnInit(): void {
    this.taskieService.getAllSignal();
  }
}