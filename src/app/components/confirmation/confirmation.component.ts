import { Component, Input, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ICosmetic, ITaskieLevel, IUser } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { ModalComponent } from '../modal/modal.component';
import { CosmeticService } from '../../services/cosmetic.service';
import { TaskieLevelService } from '../../services/taskie-level.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [ ModalComponent,   MatSnackBarModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  private userService = inject(UserService);
  private cosmeticService = inject(CosmeticService);
  private taskieLevelService = inject(TaskieLevelService);
  private snackBar = inject(MatSnackBar);
  @Input() title!: string;
  @Input() cosmetic: ICosmetic = {
    sprite: '',
    name: ''
  };
  @Input() taskieLvl: ITaskieLevel = {};
  @Input() user: IUser = {
    email: '',
    lastname: '',
    password: '',
    name: ''
  };
  
  deletitionController(deletionType: string){
    switch(deletionType){
      case "Delete Cosmetic": {
        this.deleteCosmetic(this.cosmetic);
        break;
      }

      case "Delete Taskie Level": {
        this.deleteTaskieLevel(this.taskieLvl);
        break;
      }

      default:{
        this.deleteUser(this.user)
        break;
      }
    }
  }

  deleteUser(user: IUser) {
    this.userService.deleteUserSignal(user).subscribe({
      next: () => {
        this.snackBar.open('User deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting user', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  deleteCosmetic(cosmetic: ICosmetic) {
    this.cosmeticService.deleteCosmeticSignal(cosmetic).subscribe({
      next: () => {
        this.snackBar.open('Cosmetic deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting cosmetic', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  deleteTaskieLevel(taskieLvl: ITaskieLevel) {
    this.taskieLevelService.deleteTaskieLevelSignal(taskieLvl).subscribe({
      next: () => {
        this.snackBar.open('Level deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting level', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
  
}
