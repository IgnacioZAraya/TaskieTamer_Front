import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskieService } from '../../../services/taskie.service'; 
import { ITaskie } from '../../../interfaces';
import { ProfileService } from '../../../services/profile.service';
import { CreateTaskieComponent } from '../taskieForm/taskieForm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-taskie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userTaskie.component.html',
  styleUrls: ['./userTaskie.component.scss']
})
export class UserTaskieListComponent implements OnInit {
  taskies: ITaskie[] = [];
  private injector = inject(Injector);
  public profileService = inject(ProfileService);
  public taskieService = inject(TaskieService);
  public progressPercentage!: string;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTaskiesForUser();
  }

   loadTaskiesForUser(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const user = this.profileService.user$();
        const allTaskies = this.taskieService.taskies$();
        if (user && user.id) {
          this.taskies = allTaskies.filter(taskie => taskie.user.id === user.id);
        }
      });
    });
  }

  viewTaskieDetail(taskieId: number): void {
    this.router.navigate(['app/taskie/', taskieId]);
  }

  openTaskieForm(): void {
    this.dialog.open(CreateTaskieComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
}
  
}