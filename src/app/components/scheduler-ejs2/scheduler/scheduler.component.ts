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
import { IUser, ITask } from "../../../interfaces";
import { HttpClient } from '@angular/common/http';

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
    if (option === "add") {
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

      let addObj: Record<string, any> = {
        Id: this.scheduleObj.getEventMaxID(),
        Name: taskName,
        StartDate: new Date(this.scheduleObj.activeCellsData.startTime),
        EndDate: new Date(this.scheduleObj.activeCellsData.endTime),
        Priority: taskPriority,
        Description: taskDescription,
      };

      this.scheduleObj.addEvent(addObj);
    }
    this.scheduleObj.closeQuickInfoPopup();
  }
}
