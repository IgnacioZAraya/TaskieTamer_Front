import { CommonModule } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ConfirmationComponent } from "../../confirmation/confirmation.component";
import { ModalComponent } from "../../modal/modal.component";
import { TaskieLevelFormComponent } from "../taskie-level-form/taskie-level-form.component";
import { ITaskieLevel } from "../../../interfaces";
import { TaskieLevelService } from "../../../services/taskie-level.service";

@Component({
  selector: "app-taskie-level-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    TaskieLevelFormComponent,
    ConfirmationComponent,
    MatSnackBarModule,
  ],
  templateUrl: "./taskie-level-list.component.html",
  styleUrl: "./taskie-level-list.component.scss",
})
export class TaskieLevelListComponent {
  public search: String = "";
  public taskieLvlList: ITaskieLevel[] = [];
  private service = inject(TaskieLevelService);
  public currentLevel: ITaskieLevel = {
    hasEvolution: false,
    value: 0,
    name: "",
  };

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.taskieLvlList = this.service.taskieLevels$();
    });
  }

  showDetail(taskieLvl: ITaskieLevel, modal: any) {
    this.currentLevel = { ...taskieLvl };
    modal.show();
  }

  showConfirmation(taskieLvl: ITaskieLevel, modal: any) {
    this.currentLevel = { ...taskieLvl };
    modal.show();
  }
}
