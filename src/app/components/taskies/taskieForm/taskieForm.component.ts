
import { Component, Injector, Input, OnInit, effect, inject, runInInjectionContext } from '@angular/core';
import { ITaskie, ISpecie, IStatus, ITaskieSpec } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TaskieService } from '../../../services/taskie.service';
import { SpecieService } from '../../../services/specie.service';
import { ProfileService } from '../../../services/profile.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-taskie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule],
  templateUrl: './taskieForm.component.html',
  styleUrls: ['./taskieForm.component.scss']
})


export class CreateTaskieComponent implements OnInit {
  taskieForm: FormGroup;
  speciesList: any[] = [];
  private injector = inject(Injector);
  public taskieService = inject(TaskieService);
  public profileService = inject(ProfileService);
  public speciesService = inject(SpecieService);
  toastSvc = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    this.taskieForm = this.fb.group({
      name: [''],
      species: ['']
    });
  }

  ngOnInit(): void {
    this.loadSpecies();
  }

  loadSpecies(): void {
    this.speciesService.getAllSignal().subscribe((data: any[]) => {
      this.speciesList = data;
    });
  }

  
  onSubmit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const user = this.profileService.user$();
        if (this.taskieForm.valid && user && user.id) {
          const selectedSpeciesId = this.taskieForm.value.species;
          const selectedSpecies = this.speciesList.find(specie => specie.id === parseInt(selectedSpeciesId, 10));
          
          if (!selectedSpecies) {
            this.toastSvc.warning("Specie not selected!")
            return;
          }

          const taskieData: ITaskieSpec = {
            name: this.taskieForm.value.name,
            specieId: selectedSpecies.id,
            userId: user.id
          };

          console.log('Taskie Data:', taskieData);

          this.taskieService.saveTaskieSignal(taskieData).subscribe(response => {
            this.toastSvc.success("Taskie Created!");
          }, error => {
            this.toastSvc.error("Failed Creating Taskie");
          });
        } else {
          this.toastSvc.success("User not Found!");
        }
      });
    });
  }
}