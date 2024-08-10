import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ISpecie } from '../../interfaces';

@Component({
  selector: 'app-taskie-dex-modal',
  template: `
    <div mat-dialog-content class="modal-content">
    <h2 mat-dialog-title>{{ data.name }}</h2>
      <img [src]="data.sprite" alt="{{ data.name }} Image" class="taskie-modal-image"/>
      <p>{{ data.description }}</p>
    </div>
    <div mat-dialog-actions>
    <button mat-button (click)="onClose()">Close</button>
    </div>
  `, styleUrl: "./taskieModal.component.scss"

})
export class TaskieDexModalComponent {
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: ISpecie,
      private dialogRef: MatDialogRef<TaskieDexModalComponent>
    ) {}
  
    onClose(): void {
      this.dialogRef.close();
    }
  }