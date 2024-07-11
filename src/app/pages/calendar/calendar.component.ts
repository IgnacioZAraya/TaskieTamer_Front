import { Component } from "@angular/core";
import {
  ScheduleModule,
  RecurrenceEditorModule,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  DayService,
  EventSettingsModel,
  DragAndDropService,
  ResizeService,
} from "@syncfusion/ej2-angular-schedule";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { Subject } from "rxjs";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule],
  providers: [
    WeekService,
    WorkWeekService,
    MonthService,
    DayService,
    AgendaService,
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
}
