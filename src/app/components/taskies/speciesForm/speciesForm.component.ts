import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SpecieService } from '../../../services/specie.service';
import { Router } from '@angular/router';
import { ISpecie } from '../../../interfaces';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-specie',
  standalone: true,  
  imports: [FormsModule, MatInputModule, MatButtonModule, MatDialogModule], 
  templateUrl: './speciesForm.component.html',
  styleUrls: ['./speciesForm.component.scss']
})
export class AddSpecieComponent {
    name: string = '';
    description: string = '';
    selectedFile: File | null = null;
  
    constructor(private specieService: SpecieService, private router: Router,   public dialogRef: MatDialogRef<AddSpecieComponent>) {}
  
    onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0];
    }
  
    onSubmit(): void {
      if (this.selectedFile && this.name && this.description) {
        this.specieService
          .saveSpecieWithImage(this.name, this.description, this.selectedFile)
          .subscribe({
            next: () => this.router.navigate(['/taskie-dex']),
            error: (error) => console.error('Error saving specie', error),
          });
      } else {
        alert('Please fill in all fields and select an image.');
      }
    }
    cancel(): void {
        this.dialogRef.close();
      }
  }