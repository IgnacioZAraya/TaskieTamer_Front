import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IFeedBackMessage, ILevel, IPrize } from '../../../interfaces';
import { UserLevelService } from '../../../services/user-level.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-level-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-level-form.component.html',
  styleUrl: './user-level-form.component.scss'
})
export class UserLevelFormComponent {
  @Input() title!: string;
  @Input() level: ILevel = {};
  @Input() cosmetic: IPrize = {};

  @Input() action: string = "add";
  service = inject(UserLevelService);
  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  toastSvc = inject(ToastrService);

  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.service[
        this.action == "add" ? "saveUserLevelSignal" : "updateUserLevelSignal"
      ](this.level).subscribe({
        next: () => {
          this.feedbackMessage.message = `Level successfully ${
            this.action == "add" ? "added" : "updated"
          }`;

          this.toastSvc.success(this.feedbackMessage.message, "SUCCES!!!");
        },
        error: (error: any) => {
          this.feedbackMessage.message = error.message;

          this.toastSvc.error(this.feedbackMessage.message, "OH NO!");
        },
      });
    }
  }
}
