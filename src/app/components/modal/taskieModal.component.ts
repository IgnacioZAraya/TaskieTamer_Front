import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IRoleType, ISpecie } from '../../interfaces';
import { AddSpecieComponent } from '../taskies/speciesForm/speciesForm.component';
import { SpecieService } from '../../services/specie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-taskie-dex-modal',
  standalone: true,
  templateUrl: "./taskieModal.component.html", 
  styleUrl: "./taskieModal.component.scss",
  imports: [CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatInputModule, 
    MatButtonModule]

})
export class TaskieDexModalComponent {
    public hasRole: boolean;
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: ISpecie,
      private dialogRef: MatDialogRef<TaskieDexModalComponent>,
      private specieService: SpecieService,
      private authService: AuthService,
      private dialog: MatDialog
    ) {
      this.hasRole = this.authService.hasRole(IRoleType.base);

    }
  
    onClose(): void {
      this.dialogRef.close();
    }
    openEditSpecieForm(specie: ISpecie): void {
      const dialogRef = this.dialog.open(AddSpecieComponent, {
        data: specie,
        width: '500px',
        panelClass: 'custom-dialog-container'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.specieService.updateSpecie(specie.id, result.name, result.description, result.selectedFile || undefined, result.selectedEvolution || undefined).subscribe();
        }
      });
    }
  }