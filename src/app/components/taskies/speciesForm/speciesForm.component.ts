import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SpecieService } from '../../../services/specie.service';
import { ISpecie } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-add-specie',
  standalone: true,
  imports:[ CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatInputModule, 
    MatButtonModule,
    MatFormFieldModule ],
  templateUrl: './speciesForm.component.html',
  styleUrls: ['./speciesForm.component.scss']
})
export class AddSpecieComponent {
  name: string = '';
  description: string = '';
  selectedFile: File | null = null;
  selectedEvolution: File | null = null;
  isEditing: boolean = false;
  specieId: number | null = null;

  constructor(
    private specieService: SpecieService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddSpecieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISpecie | null
  ) {
    if (data) {
      this.isEditing = true;
      this.specieId = data.id;
      this.name = data.name;
      this.description = data.description;
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  onEvolutionFileSelected(event: any): void {
    this.selectedEvolution = event.target.files[0];
  }

  onSubmit(): void {
    if (this.isEditing && this.specieId) {
      this.specieService
        .updateSpecie(this.specieId, this.name, this.description, this.selectedFile || undefined, this.selectedEvolution || undefined)
        .subscribe({
          next: () => this.dialogRef.close(),
          error: (error) => console.error('Error updating specie', error),
        });
    } else if (this.name && this.description && this.selectedFile && this.selectedEvolution) {
      this.specieService
        .saveSpecieWithImage(this.name, this.description, this.selectedFile, this.selectedEvolution)
        .subscribe({
          next: () => this.dialogRef.close(),
          error: (error) => console.error('Error saving specie', error),
        });
    } else {
      alert('Please fill in all fields.');
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  deleteSpecie(): void {
    if (this.specieId) {
      this.specieService.deleteSpecie(this.specieId).subscribe({
        next: () => {
          this.dialog.closeAll();
        },
        error: (error) => console.error('Error deleting specie', error),
      });
    }
  }
}