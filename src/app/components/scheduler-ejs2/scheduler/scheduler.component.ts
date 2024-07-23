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
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
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
        startTime: new Date(event.startDate!),
        endTime: new Date(event.endDate!)
      }));
      this.eventObject = {
        dataSource: events,
        fields: {
          subject: { name: "name" },
          startTime: { name: "startTime" },
          endTime: { name: "endTime" },
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
  
    // Obtener fechas seleccionadas
    let startTime = this.scheduleObj.activeCellsData.startTime;
    let endTime = this.scheduleObj.activeCellsData.endTime;
  
    // Validar fechas
    if (!startTime || !endTime) {
      console.error("Fechas inválidas o no seleccionadas.");
      return;
    }
  
    // Crear objetos Date
    let startDate = new Date(startTime);
    let endDate = new Date(endTime);
  
    // Validar que las fechas sean válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Fechas inválidas.");
      return;
    }

    
  
    if (option === "add") {
      let addObj: Record<string, any> = {
        name: taskName,
        startDate: startDate.toISOString(),  
        endDate: endDate.toISOString(),      
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
        StartDate: startDate,
        EndDate: endDate,
        Priority: taskPriority,
        Description: taskDescription,
      });
    } else if (option === "edit") {
      let eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
    
      // Asegúrate de que el ID esté presente
      if (!eventDetails || !eventDetails['Id']) {
        console.error("El ID del evento es undefined");
        return;
      }
    
      // Obtener los valores actualizados
      let taskName = (
        (quickPopup.querySelector("#taskName") as EJ2Instance)
          .ej2_instances[0] as TextBoxComponent
      ).value;
      
      // Convertir priority a número
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
    
      // Obtener fechas seleccionadas
      let startTime = this.scheduleObj.activeCellsData.startTime;
      let endTime = this.scheduleObj.activeCellsData.endTime;
    
      if (!startTime || !endTime) {
        console.error("Fechas inválidas o no seleccionadas.");
        return;
      }
    
      // Convertir las fechas a objetos Date
      let startDate = new Date(startTime);
      let endDate = new Date(endTime);
    
      // Crear objeto para actualizar la tarea
      let updatedTask: ITaskSpec = {
        name: taskName,
        priority: priorityNumber,
        description: taskDescription,
        startDate: startDate,  // Pasar objeto Date directamente
        endDate: endDate,      // Pasar objeto Date directamente
      };
    
      // Enviar solicitud PUT al backend
      this.http.put(`task/${eventDetails['Id']}`, updatedTask).subscribe(response => {
        console.log('Actualizar tarea funciona', response);
    
        // Actualizar el evento en el calendario
        this.scheduleObj.saveEvent({
          ...eventDetails,
          ...updatedTask,
        });
    
        // Refrescar los eventos
        this.loadEvents();
      });        
    } else if (option === "delete") {
      let eventDetails: Record<string, any> = this.scheduleObj.activeEventData.event as Record<string, any>;
      
      // Verificar que el ID esté presente
      if (eventDetails && eventDetails['Id']) {
        this.http.delete('task/' + eventDetails['Id']).subscribe(response => {
          console.log('Eliminar tarea funciona', response);
          this.scheduleObj.deleteEvent(eventDetails['Id']);
          this.loadEvents(); // Refrescar eventos después de eliminar
        });
      } else {
        console.error("El ID del evento es undefined");
      }
    }
  
    this.scheduleObj.closeQuickInfoPopup();
  }
}
  


