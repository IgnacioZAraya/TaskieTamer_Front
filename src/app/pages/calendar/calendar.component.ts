import { isNullOrUndefined } from "util";
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
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import { closest } from "@syncfusion/ej2-base";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { Subject } from "rxjs";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [
    ScheduleModule,
    RecurrenceEditorModule,
    TextBoxModule,
    ButtonModule,
  ],
  providers: [
    WeekService,
    MonthService,
    DayService,
    DragAndDropService,
    ResizeService,
  ],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent {
  /*private eventData: DataMannager = new DataManager({
    url: //URL DEL API ,
    adaptor: new WebApiAdaptor,
    crossDomain: true
  });*/

  @ViewChild("schedule") scheduleObj!: ScheduleComponent;
  public eventObject: EventSettingsModel = {
    //dataSource: this.eventData
    dataSource: [
      {
        Subject: "Prueba",
        StartTime: new Date(2024, 6, 10, 4, 0),
        EndTime: new Date(2024, 6, 10, 6, 0),
        //RecurrenceRule: "FREQ=DAILY;INTERVAL=1;COUNT=10",
        //IsReadonly: true,
        //IsBlock: true,
      },
    ],
    /* fields: {
      subject: { default: "(Nuevo Evento)", title: "Nombre del Evento" },
    },*/
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
}
