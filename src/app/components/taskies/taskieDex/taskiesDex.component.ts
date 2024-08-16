import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SpecieService } from '../../../services/specie.service';
import { IRoleType, ISpecie } from '../../../interfaces';
import { TaskieDexModalComponent } from '../../modal/taskieModal.component';
import { AddSpecieComponent } from '../speciesForm/speciesForm.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-taskie-dex',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatInputModule, 
    MatButtonModule],
  templateUrl: './taskieDex.component.html',
  styleUrls: ['./taskieDex.component.scss']
})
export class TaskieDexComponent implements OnInit {
  species: ISpecie[] = [];
  private injector = inject(Injector);
  public hasRole: boolean;
  
  constructor(
   private specieService: SpecieService,
   private authService : AuthService,
    private dialog: MatDialog
   
  ) {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.species = this.specieService.species$();
      });
    });
    this.hasRole = this.authService.hasRole(IRoleType.base);
  }

  ngOnInit(): void {
    this.specieService.getAllSpecies();
  
  }

  openSpecieModal(specie: ISpecie): void {
    this.dialog.open(TaskieDexModalComponent, {
      data: specie,
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
  }

  openAddSpecieForm(): void {
    this.dialog.open(AddSpecieComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });
  }

 

  deleteSpecie(specie: ISpecie): void {
    this.specieService.deleteSpecie(specie.id).subscribe(() => {

    });
  }
}