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
  @ViewChild('formModal') formModal!: ModalComponent; // Obtener referencia al modal

  // Define the array of tasks
  tasks = [
    { name: 'Take out the trash' },
    { name: 'Brush teeth' },
    { name: 'Clean the room' },
    { name: 'Shower' }
  ];

  // Property to hold the selected task
  selectedTask = { name: '' };

  // Method to handle task selection
  selectTask(task: any) {
    this.selectedTask = task;
    if (this.formModal) {
      this.formModal.show(); // Mostrar el modal usando la referencia
    }
  }
}