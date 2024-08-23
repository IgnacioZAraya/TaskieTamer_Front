import { Component } from "@angular/core";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { CommonModule } from "@angular/common";
import { TaskieLevelFormComponent } from "../../components/level-taskie/taskie-level-form/taskie-level-form.component";
import { TaskieLevelListComponent } from "../../components/level-taskie/taskie-level-list/taskie-level-list.component";

@Component({
  selector: "app-taskie-level",
  standalone: true,
  imports: [
    TaskieLevelFormComponent,
    TaskieLevelListComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule,
  ],
  templateUrl: "./taskie-level.component.html",
  styleUrl: "./taskie-level.component.scss",
})
export class TaskieLevelComponent {}
