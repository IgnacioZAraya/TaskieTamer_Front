import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskieService } from '../../../services/taskie.service'; 
import { ITaskie } from '../../../interfaces';

@Component({
  selector: 'app-taskie-dex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taskieDex.component.html',
  styleUrls: ['./taskieDex.component.scss']
})
export class TaskieDexComponent implements OnInit {
  taskies: ITaskie[] = [];
  private injector = inject(Injector);

  constructor(
    private taskieService: TaskieService,
    private router: Router
  ) {
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

  viewTaskieDetail(taskieId: number): void {
    this.router.navigate(['app/taskie/', taskieId]);
  }
}