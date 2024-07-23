import { Component, Inject, Input, inject } from '@angular/core';
import {TaskieService} from '../../../services/taskies.service'
import { IFeedBackMessage, IFeedbackStatus, ITaskie} from '../../../interfaces';
import { NgOptimizedImage, NgFor, CommonModule  } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: "app-taskie-profile",
    standalone: true,
    imports: [NgOptimizedImage,
        NgFor, CommonModule,
        [RouterLink]
     ],
    templateUrl: "./taskie-prof.component.html",
    styleUrls: ["./taskie-prof.component.scss"]
  })
  export class TaskieDetailComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public taskie: ITaskie) {
      
    }
  }
