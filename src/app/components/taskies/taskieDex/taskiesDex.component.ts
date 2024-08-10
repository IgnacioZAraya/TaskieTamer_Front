import { SpecieService } from './../../../services/specie.service';
import { Component, effect, inject, Injector, OnInit, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ISpecie } from '../../../interfaces';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskieDexModalComponent } from '../../modal/taskieModal.component';
import { AddSpecieComponent } from '../speciesForm/speciesForm.component';

@Component({
  selector: 'app-taskie-dex',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  templateUrl: './taskieDex.component.html',
  styleUrls: ['./taskieDex.component.scss']
})
export class TaskieDexComponent implements OnInit {
  species: ISpecie[] = [];
  private injector = inject(Injector);

  constructor(
    private specieService: SpecieService,
    private router: Router,
    private dialog: MatDialog
  ) {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.species = this.specieService.species$();
      
      });
    });
  }

  ngOnInit(): void {
    this.specieService.getAllSignal();
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

}