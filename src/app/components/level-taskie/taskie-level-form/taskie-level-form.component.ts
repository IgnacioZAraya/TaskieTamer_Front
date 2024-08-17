import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ICosmetic, IFeedBackMessage, ITaskieLevel} from '../../../interfaces';
import { TaskieLevelService } from '../../../services/taskie-level.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-taskie-level-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taskie-level-form.component.html',
  styleUrl: './taskie-level-form.component.scss'
})
export class TaskieLevelFormComponent {
  @Input() title!: string;
  @Input() level: ITaskieLevel = {};
  @Input() cosmetic: ICosmetic = {};

  @Input() action: string = "add";
  service = inject(TaskieLevelService);
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
        this.action == "add" ? "saveTaskieLevelSignal" : "updateTaskieLevelSignal"
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
