import { CommonModule } from "@angular/common";
import { Component, ViewChild, effect, inject } from "@angular/core";
import { ButtonModule, CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { DateTimePickerComponent, DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DropDownListComponent, DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { TextBoxComponent, TextBoxModule } from "@syncfusion/ej2-angular-inputs";
import {
    DayService,
    DragAndDropService,
    EJ2Instance,
    EventSettingsModel,
    MonthService,
    PopupOpenEventArgs,
    RecurrenceEditorModule,
    RenderCellEventArgs,
    ResizeService,
    ScheduleComponent,
    ScheduleModule,
    WeekService,
} from "@syncfusion/ej2-angular-schedule";
import { closest } from "@syncfusion/ej2-base";
import { ITaskSpec } from "../../../interfaces";
import { AuthService } from "../../../services/auth.service";
import { TaskService } from "../../../services/task.service";
import { FormComponent } from "../form/form.component";

@Component({
  selector: "app-scheduler",
  standalone: true,
  imports: [
    ScheduleModule,
    RecurrenceEditorModule,
    TextBoxModule,
    ButtonModule,
    CheckBoxModule,
    DateTimePickerModule,
    DropDownListModule,
    CommonModule
  ],
  providers: [
    WeekService,
    MonthService,
    DayService,
    DragAndDropService,
    ResizeService,
  ],
  templateUrl: "./scheduler.component.html",
  styleUrls: ["./scheduler.component.scss"],
})
export class SchedulerComponent {
  items: any[] = [
    { text: 'Never', value: 'Never' },
    { text: 'Daily', value: 'Daily' },
    { text: 'Weekly', value: 'Weekly' },
    { text: 'Monthly', value: 'Monthly' }
  ];
  public priority: string[] = ["High", "Medium", "Low"];
  public isRecurrent: boolean = false;
  public currentUserId: number | undefined = 1;
  public eventObject!: EventSettingsModel;
  @ViewChild("schedule") scheduleObj!: ScheduleComponent;
  @ViewChild(FormComponent) formComponent!: FormComponent;

  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  public minDate: Date = new Date();
  public maxDate: Date = new Date();

  constructor() {
    this.currentUserId = this.authService.getUser()?.id;
    effect(() => {
      this.updateEventSettings();
    });

    this.minDate.setFullYear(this.minDate.getFullYear() - 1);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  onRecurrenceChange(event: any): void {
    const selectedValue = event.itemData.value;
    this.isRecurrent = selectedValue !== 'Never';
  }
  
  ngOnInit(): void {
    this.taskService.getTasksForCurrentUser();
    if (this.formComponent) {
      this.formComponent.taskChanged.subscribe(() => {
        this.taskService.getTasksForCurrentUser();
      });
    }
    let toolbarElement = this.scheduleObj.element.querySelector(".e-schedule .e-schedule-toolbar");
    (toolbarElement as any).style.background = '#ecd381';
  }

  public onRenderCell(args: RenderCellEventArgs): void {
    (args.element as any).style.background = '#ecd381';
  }

  updateEventSettings(): void {
    const tasks = this.taskService.tasks$();
    const events = tasks.map(event => ({
      ...event,
      startDate: new Date(event.startDate!),
      endDate: new Date(event.endDate!),
    }));
    this.eventObject = {
      dataSource: events,
      fields: {
        subject: { name: "name" },
        startTime: { name: "startDate" },
        endTime: { name: "endDate" },
        description: { name: "description" },
      },
    };
  }
  
  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === "Editor") {
      args.cancel = true;
    }
  }

  public onCloseClick() {
    this.scheduleObj.closeQuickInfoPopup();
  }

  public toggleRecurrencyForm(event: any) {
    this.isRecurrent = event.checked;
  }

  public addTask(e: Event, option: string) {
    let quickPopup: HTMLElement = closest(
      e.target as HTMLElement,
      ".e-quick-popup-wrapper"
    ) as HTMLElement;

    let taskName = (
      (quickPopup.querySelector("#taskName") as EJ2Instance)
        .ej2_instances[0] as TextBoxComponent
    ).value;
    let taskPriority = (
      (quickPopup.querySelector("#taskPriority") as EJ2Instance)
        .ej2_instances[0] as DropDownListComponent
    ).value;
    let taskDescription = (
      quickPopup.querySelector("#taskDescription") as HTMLTextAreaElement
    ).value;
    let taskRecurrency = (
      (quickPopup.querySelector("#taskRecurrency") as EJ2Instance)
        .ej2_instances[0] as DropDownListComponent
    ).value;
    let taskNumRepetition = (
      (quickPopup.querySelector("#taskNumRepetition") as EJ2Instance)
        .ej2_instances[0] as TextBoxComponent
    ).value;
    let taskStartDate = new Date(
      (
        (quickPopup.querySelector("#taskStartDate") as EJ2Instance)
          .ej2_instances[0] as DateTimePickerComponent
      ).value
    );
    let taskEndDate = new Date(
      (
        (quickPopup.querySelector("#taskEndDate") as EJ2Instance)
          .ej2_instances[0] as DateTimePickerComponent
      ).value
    );

    if (option === "add") {
      let addObj: Record<string, any> = {
        name: taskName,
        startDate: taskStartDate,
        endDate: taskEndDate,
        priority: taskPriority,
        description: taskDescription,
        userId: this.currentUserId,
        completed: false,
        verified: false,
        visible: true,
        recurrent: taskRecurrency,
        repeatTimes: taskNumRepetition,
      };

      this.taskService.saveTaskSignal(addObj).subscribe(response => {
        console.log('Agregar tarea funciona', response);
      });

      this.scheduleObj.addEvent({
        Id: this.scheduleObj.getEventMaxID(),
        Name: taskName,
        StartDate: taskStartDate,
        EndDate: taskEndDate,
        Priority: taskPriority,
        Description: taskDescription,
        Recurrency: taskRecurrency,
        RepeatTimes: taskNumRepetition,
      });
    } else if (option === "edit") {
      let eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
      let eventId = eventDetails['id'] || eventDetails['Id'];
      if (!eventId) {
        console.error("El ID del evento es undefined");
        return;
      }

      let taskName = (
        (quickPopup.querySelector("#taskName") as EJ2Instance)
          .ej2_instances[0] as TextBoxComponent
      ).value;

      let taskPriority = (
        (quickPopup.querySelector("#taskPriority") as EJ2Instance)
          .ej2_instances[0] as DropDownListComponent
      ).value as string;

      let taskDescription = (
        quickPopup.querySelector("#taskDescription") as HTMLTextAreaElement
      ).value;

      let taskRecurrency = (
        (quickPopup.querySelector("#taskRecurrency") as EJ2Instance)
          .ej2_instances[0] as DropDownListComponent
      ).value as string;

      let taskNumRepetition = (
        (quickPopup.querySelector("#taskNumRepetition") as EJ2Instance)
          .ej2_instances[0] as TextBoxComponent
      ).value;
      let RepetitioNumber = Number(taskNumRepetition);
      if (isNaN(RepetitioNumber)) {
        return;
      }

      let taskStartDate = new Date(
        (
          (quickPopup.querySelector("#taskStartDate") as EJ2Instance)
            .ej2_instances[0] as DateTimePickerComponent
        ).value
      );

      let taskEndDate = new Date(
        (
          (quickPopup.querySelector("#taskEndDate") as EJ2Instance)
            .ej2_instances[0] as DateTimePickerComponent
        ).value
      );

      let updatedTask: ITaskSpec = {
        id: eventId,
        name: taskName,
        priority: taskPriority,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        visible: true,
        recurrent: taskRecurrency,
        repeatTimes: RepetitioNumber,
      };

      console.log('Updated Task:', updatedTask);

      this.taskService.updateTaskSignal(updatedTask).subscribe(response => {
        console.log('Actualizar tarea funciona', eventId);

        this.scheduleObj.saveEvent({
          ...eventDetails,
          ...updatedTask,
        });
      });
    } else if (option === "delete") {
      let eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;

      console.log("Detalles del evento: ", eventDetails);
      let eventId = eventDetails['id'] || eventDetails['Id'];
      if (eventId) {
        this.taskService.deleteTaskSignal(eventDetails).subscribe(response => {
          console.log('Eliminar tarea funciona', eventId);
          this.scheduleObj.deleteEvent(eventId);
        });
      } else {
        console.error("El ID del evento es undefined");
      }
    }
    this.scheduleObj.closeQuickInfoPopup();
  }

}