import { isNullOrUndefined } from "util";
import { Component } from "@angular/core";
import { EJ2Instance } from "@syncfusion/ej2-angular-schedule";
import {
  TextBoxComponent,
  TextBoxModule,
} from "@syncfusion/ej2-angular-inputs";
import { closest } from "@syncfusion/ej2-base";
import { ButtonModule, CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
// import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [
    TextBoxModule,
    ButtonModule,
    CheckBoxModule,
    FormsModule,
    CommonModule,
    DateTimePickerModule,
  ],
  // providers: [DatePickerModule],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.scss",
})
export class FormComponent {
  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.controls[controlName].markAsTouched();
      });
      return;
    }
  }
}
