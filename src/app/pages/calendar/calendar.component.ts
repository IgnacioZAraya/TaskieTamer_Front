import { Component, ViewChild } from "@angular/core";
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
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent {
  @ViewChild('formModal') formModal!: ModalComponent; 

  tasks = [
    { name: 'Take out the trash' },
    { name: 'Brush teeth' },
    { name: 'Clean the room' },
    { name: 'Shower' }
  ];

  selectedTask = { name: '' };

  selectTask(task: any) {
    this.selectedTask = task;
    if (this.formModal) {
      this.formModal.show(); 
    }
  }
}