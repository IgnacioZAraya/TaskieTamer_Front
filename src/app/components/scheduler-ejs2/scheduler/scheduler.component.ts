import { Component, ViewChild } from "@angular/core";
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
import { TextBoxComponent, TextBoxModule } from "@syncfusion/ej2-angular-inputs";
import { ButtonModule, CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { closest } from "@syncfusion/ej2-base";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { DateTimePickerComponent, DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { AuthService } from "../../../services/auth.service";
import { IUser, ITask, ITaskSpec } from "../../../interfaces";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";

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
  public items: string[] = ["Daily", "Weekly", "Monthly"];
  public isRecurrent: boolean = false;
  public currentUserId: number | undefined = 1;
  public eventObject!: EventSettingsModel;
  @ViewChild("schedule") scheduleObj!: ScheduleComponent;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.currentUserId = authService.getUser()?.id;
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.http.get<ITask[]>('task/userId/' + this.currentUserId?.toLocaleString()).subscribe((data: ITask[]) => {
      // Convertir fechas a objetos Date
      const events = data.map(event => ({
        ...event,
        startDate: new Date(event.startDate!),
        endDate: new Date(event.endDate!)
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
    });
  }


  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === "Editor") {
      args.cancel = true;
    }
  }

  public toggleRecurrencyForm(event: any) {
    this.isRecurrent = event.checked;
  }

  public addTask(e: Event, option: string) {
    let quickPopup: HTMLElement = closest(
      e.target as HTMLElement,
      ".e-quick-popup-wrapper"
    ) as HTMLElement;
  
    // Obtener los valores del formulario
    let taskName = (
      (quickPopup.querySelector("#taskName") as EJ2Instance)
        .ej2_instances[0] as TextBoxComponent
    ).value;
    let taskPriority = (
      (quickPopup.querySelector("#taskPriority") as EJ2Instance)
        .ej2_instances[0] as TextBoxComponent
    ).value;
    let taskDescription = (
      quickPopup.querySelector("#taskDescription") as HTMLTextAreaElement
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
      };
  
      this.http.post('task', addObj).subscribe(response => {
        console.log('Agregar tarea funciona', response);
        this.loadEvents();
      });
  
      this.scheduleObj.addEvent({
        Id: this.scheduleObj.getEventMaxID(),
        Name: taskName,
        StartDate: taskStartDate,
        EndDate: taskEndDate,
        Priority: taskPriority,
        Description: taskDescription,
      });
    } else if (option === "edit") {
      let eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
    
      console.log("Detalles del evento: ", eventDetails); // Log de depuración
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
          .ej2_instances[0] as TextBoxComponent
      ).value;
      let priorityNumber = Number(taskPriority);
      if (isNaN(priorityNumber)) {
        console.error("La prioridad no es un número válido.");
        return;
      }
    
      let taskDescription = (
        quickPopup.querySelector("#taskDescription") as HTMLTextAreaElement
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
    
      let updatedTask: ITaskSpec = {
        name: taskName,
        priority: priorityNumber,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        visible: true
      };
    
      console.log('Updated Task:', updatedTask);
    
      this.http.put(`task/${eventId}`, updatedTask).subscribe(response => {
        console.log('Actualizar tarea funciona', eventId);
    
        this.scheduleObj.saveEvent({
          ...eventDetails,
          ...updatedTask,
        });
    
        this.loadEvents();
      });
    } else if (option === "delete") {
      let eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
  
      console.log("Detalles del evento: ", eventDetails);
      let eventId = eventDetails['id'] || eventDetails['Id'];
      if (eventId) {
        this.http.delete('task/' + eventId).subscribe(response => {
          console.log('Eliminar tarea funciona', eventId);
          this.scheduleObj.deleteEvent(eventId);
          this.loadEvents(); 
        });
      } else {
        console.error("El ID del evento es undefined");
      }
    }
  
    this.scheduleObj.closeQuickInfoPopup();
  }
    
}
  


