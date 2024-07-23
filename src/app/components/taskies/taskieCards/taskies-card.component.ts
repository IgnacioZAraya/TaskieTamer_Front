import { Component, Input, OnInit, inject } from '@angular/core';
import { IFeedBackMessage, IFeedbackStatus, ITaskie} from '../../../interfaces';
import { NgOptimizedImage, NgFor  } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog } from '@angular/material/dialog'
import { TaskieService } from '../../../services/taskies.service';
import { TaskieDetailComponent } from '../taskiesProf/taskie-prof.component';
@Component({
    selector: "app-taskie-card",
    standalone: true,
    imports: [NgOptimizedImage,
        NgFor
     ],
    templateUrl: "./taskies-card.component.html",
    styleUrls: ["./taskies-card.component.scss"]
  })
  export class TaskieCardComponent implements OnInit{
    taskies: ITaskie[] = [];

 constructor(private taskieService: TaskieService, public dialog: MatDialog) {}


  ngOnInit(): void {
    this.taskieService.getAllSignal();
    this.taskies = this.taskieService.taskies$();
  }
  openTaskieDetail(taskie: ITaskie): void {
    this.dialog.open(TaskieDetailComponent, {
      data: taskie
    });
   
  }
}
