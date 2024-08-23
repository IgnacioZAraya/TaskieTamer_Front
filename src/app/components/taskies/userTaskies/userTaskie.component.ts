import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskieService } from '../../../services/taskie.service'; 
import { ITaskie } from '../../../interfaces';
import { ProfileService } from '../../../services/profile.service';
import { CreateTaskieComponent } from '../taskieForm/taskieForm.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskieLevelService } from '../../../services/taskie-level.service';

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
  public taskieLvlService = inject(TaskieLevelService);
  public progressPercentage!: string;
  public canCreateTaskie! : boolean;

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
        this.setCreateTaskie(this.taskies);
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

setCreateTaskie(taskieList : ITaskie[]): void {
  if(taskieList.length == 0 || taskieList.at(taskieList.length-1)?.lvlTaskie == this.taskieLvlService.taskieLevels$().at(this.taskieLvlService.taskieLevels$().length-1)){
    this.canCreateTaskie = true;
  }else{
    this.canCreateTaskie = false;
  }
}
  
}