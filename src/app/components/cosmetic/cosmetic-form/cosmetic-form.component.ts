import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ICosmetic, IFeedBackMessage, IFeedbackStatus } from '../../../interfaces';
import { CosmeticService } from '../../../services/cosmetic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cosmetic-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cosmetic-form.component.html',
  styleUrl: './cosmetic-form.component.scss'
})
export class CosmeticFormComponent {
  @Input() title!: string;
  @Input() cosmetic: ICosmetic = {
    sprite: "",
    name: "",
  };

  @Input() action: string = "add";
  service = inject(CosmeticService);
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
        this.action == "add" ? "saveCosmeticSignal" : "updateCosmeticSignal"
      ](this.cosmetic).subscribe({
        next: () => {
          this.feedbackMessage.message = `Cosmetic successfully ${
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
