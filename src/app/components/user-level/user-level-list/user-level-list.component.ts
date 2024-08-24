import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { ModalComponent } from '../../modal/modal.component';
import { UserLevelFormComponent } from '../user-level-form/user-level-form.component';
import { ILevel } from '../../../interfaces';
import { UserLevelService } from '../../../services/user-level.service';

@Component({
  selector: 'app-user-level-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    UserLevelFormComponent,
    ConfirmationComponent,
    MatSnackBarModule,
  ],
  templateUrl: './user-level-list.component.html',
  styleUrl: './user-level-list.component.scss'
})
export class UserLevelListComponent {
  public search: String = "";
  public userLvlList: ILevel[] = [];
  private service = inject(UserLevelService);
  public currentLevel: ILevel = {
    value: 0,
    name: "",
  };

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.userLvlList = this.service.userLevels$();
    });
  }

  showDetail(userLvl: ILevel, modal: any) {
    this.currentLevel = { ...userLvl };
    modal.show();
  }

  showConfirmation(userLvl: ILevel, modal: any) {
    this.currentLevel = { ...userLvl };
    modal.show();
  }
}
