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
} from "@syncfusion/ej2-angular-schedule";
import {
  TextBoxComponent,
  TextBoxModule,
} from "@syncfusion/ej2-angular-inputs";
import { ButtonModule, CheckBoxModule } from "@syncfusion/ej2-angular-buttons";
import { closest } from "@syncfusion/ej2-base";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
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

  @ViewChild("schedule") scheduleObj!: ScheduleComponent;
  public isRecurrent: boolean = false;

  public eventObject: EventSettingsModel = {
    dataSource: [
      {
        Subject: "Prueba",
        StartTime: new Date(2024, 6, 10, 4, 0),
        EndTime: new Date(2024, 6, 10, 6, 0),
      },
    ],
  };

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
      let addObj: Record<string, any> = {
        Id: this.scheduleObj.getEventMaxID(),
        Name: taskName,
        StartTime: new Date(this.scheduleObj.activeCellsData.startTime),
        EndTime: new Date(this.scheduleObj.activeCellsData.endTime),
      };
      this.scheduleObj.addEvent(addObj);
    }
    this.scheduleObj.closeQuickInfoPopup();
  }

  // Nuevo método para manejar el cambio del estado del checkbox
  public toggleRecurrencyForm(event: any) {
    this.isRecurrent = event.checked;
  }
}
