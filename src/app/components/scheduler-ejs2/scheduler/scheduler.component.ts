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
import {
  TextBoxComponent,
  TextBoxModule,
} from "@syncfusion/ej2-angular-inputs";
import { ButtonModule, CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { closest } from "@syncfusion/ej2-base";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";

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
  @ViewChild("schedule") scheduleObj!: ScheduleComponent;

  public data: DataManager = new DataManager({
    url: "http://localhost:8080/tasks",
    adaptor: new UrlAdaptor(),
    crossDomain: true,
  });

  public eventObject: EventSettingsModel = {
    dataSource: [
      {
        Name: "Prueba",
        StartDate: new Date(2024, 6, 17, 10, 0),
        EndDate: new Date(2024, 6, 17, 12, 0),
        Priority: 1,
        Description: "Probando 1 2 3 cha cha",
      },
    ],
    fields: {
      subject: { name: "Name" },
      startTime: { name: "StartDate" },
      endTime: { name: "EndDate" },
      description: { name: "Description" },
    },
  };

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
