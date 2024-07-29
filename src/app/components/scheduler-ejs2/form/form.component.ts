import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import {
  ScheduleModule,
  RecurrenceEditorModule,
  WeekService,
  MonthService,
  DayService,
  EventSettingsModel,
  DragAndDropService,
  ResizeService,
  ScheduleComponent,
  EJ2Instance,
  PopupOpenEventArgs,
} from "@syncfusion/ej2-angular-schedule";
import {
  IFeedBackMessage,
  ITask,
  ITaskSpec,
} from "../../../interfaces";
import {
  TextBoxComponent,
  TextBoxModule,
} from "@syncfusion/ej2-angular-inputs";
import { closest } from "@syncfusion/ej2-base";
import { ButtonModule, CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { FormsModule, NgForm } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { TaskService} from "../../../services/task.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../services/auth.service";
import { HttpClient } from "@angular/common/http";
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
    DropDownListModule,
  ],
  // providers: [DatePickerModule],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.scss",
})
export class FormComponent {
  @Output() taskChanged = new EventEmitter<void>();
  public items: string[] = ["Never", "Daily", "Weekly", "Monthly", "Yearly"];
  public items2: string[] = ["High", "Medium", "Low"];
  public currentUserId: number | undefined = 1;
  constructor(private authService: AuthService, private http: HttpClient) {
    this.currentUserId = authService.getUser()?.id;
  }
  @Input() task: ITask = {
    name: "",
    priority: "",
    startDate: new Date(),
    endDate: new Date(),
    recurrent: "",
    repeatTimes: 0,
    description: "",
  };
  @Input() taskSpec: ITaskSpec = {
    name: "",
    priority: "",
    startDate: new Date(),
    endDate: new Date(),
    recurrent: "",
    repeatTimes: 0,
    description: "",
  };
  @Input() action: string = 'add';
  service = inject(TaskService);
  feedbackMessage: IFeedBackMessage = {
    message: '',
  };

  toastSvc = inject(ToastrService);

  handleAction(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      if (this.currentUserId === undefined) {
        console.error('Current user ID is not available');
        return;
      }
      
      this.setTaskUpdt();
      this.taskSpec.userId = this.currentUserId;
  
      this.service[
        this.action == "add" ? "saveTaskSignal" : "updateTaskSignal"
      ](this.taskSpec).subscribe({
        next: () => {
          this.feedbackMessage.message = `Task successfully ${
            this.action == "add" ? "added" : "updated"
          }`;
          this.toastSvc.success(this.feedbackMessage.message, "SUCCESS!!!");
          this.taskChanged.emit();  
        },
        error: (error: any) => {
          this.feedbackMessage.message = error.message;
          this.toastSvc.error(this.feedbackMessage.message, "OH NO!");
        },
      });
    }
  }
  private setTaskUpdt(): void {
    this.taskSpec.id = this.task.id;
    this.taskSpec.name = this.task.name;
    this.taskSpec.priority = this.task.priority;
    this.taskSpec.startDate = this.task.startDate;
    this.taskSpec.endDate = this.task.endDate;
    this.taskSpec.recurrent = this.task.recurrent;
    this.taskSpec.repeatTimes = this.task.repeatTimes;
    this.taskSpec.description = this.task.description;
  }
}
  