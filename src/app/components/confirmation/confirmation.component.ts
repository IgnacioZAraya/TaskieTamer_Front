import { Component, Input, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IUser } from '../../interfaces';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [    MatSnackBarModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  private service = inject(UserService);
  private snackBar = inject(MatSnackBar);
  @Input() title!: string;
  @Input() item: IUser = {
    email: '',
    lastname: '',
    password: '',
    name: ''
  };

  deleteUser(user: IUser) {
    this.service.deleteUserSignal(user).subscribe({
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

  hide (){}
}
