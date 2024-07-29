import { Component } from "@angular/core";
import { SchedulerComponent } from "../../components/scheduler-ejs2/scheduler/scheduler.component";
import { FormComponent } from "../../components/scheduler-ejs2/form/form.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [
    SchedulerComponent,
    FormComponent,
    ModalComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent {}
