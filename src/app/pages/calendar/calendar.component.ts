import { Component } from "@angular/core";
import {
  ScheduleModule,
  RecurrenceEditorModule,
  WeekService,
  WorkWeekService,
} from "@syncfusion/ej2-angular-schedule";

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [ScheduleModule, RecurrenceEditorModule],
  providers: [WeekService, WorkWeekService],
  template: "<ejs-schedule></ejs-schedule>",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent {}
