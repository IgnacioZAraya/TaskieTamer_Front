import { DialogModule } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, Location } from '@angular/common';
import { Component, effect, inject, Injector, Input, OnInit, runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { ICosmetic, IFeedBackMessage, IInteractable, ITaskie, IUserDTO } from '../../../interfaces';
import { InteractableService } from '../../../services/interactable.service';
import { TaskieService } from '../../../services/taskie.service';
import { UserService } from '../../../services/user.service';
import { ProfileService } from './../../../services/profile.service';

@Component({
  selector: 'app-taskies-card',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    DialogModule
  ],
  templateUrl: './taskies-card.component.html',
  styleUrls: ['./taskies-card.component.scss']
})

export class TaskieViewComponent implements OnInit {
  taskie!: ITaskie;
  interactables: IInteractable[] = [];
  cosmetics: ICosmetic[] = [];
  appliedCosmetic: ICosmetic | null = null;   
  private dragImage: HTMLImageElement | null = null;
  feedbackMessage: IFeedBackMessage = { message: "" };
  selectedCosmeticSprite: string | undefined;
  private injector = inject(Injector);
  public profileService = inject(ProfileService);
  public userDTO!: IUserDTO;
  toastSvc = inject(ToastrService);
  public userService = inject(UserService);
  public isEvolved!: boolean;
  public experience: number | undefined;
  public level: number | undefined;
  public progressPercentage!: string;
  private previouslyEvolved: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private taskieService: TaskieService,
    private interactableService: InteractableService,
    private location: Location
  ) 
  {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.interactables = this.interactableService.interactables$();
      });
    });
  }

  ngOnInit(): void {
    this.loadUserDTO();
    const taskieId = +this.route.snapshot.paramMap.get('id')!;
    this.taskieService.getAllSignal();
    this.interactableService.getAllSignal();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const taskies = this.taskieService.taskies$();
        const updatedTaskie = taskies.find(t => t.id === taskieId) || {} as ITaskie;
        
        if (updatedTaskie.evolved !== this.taskie?.evolved) {
          
          this.removeAppliedCosmetic();
        }

        this.taskie = updatedTaskie;
        this.isEvolved = this.taskie.evolved;
        this.loadCosmeticsForTaskie();
      });
    });
  }
  loadUserDTO(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const user = this.profileService.user$();
        if (user && user.id) {
          this.userDTO = {
            ...user,
            foodUser: user.foodUser || 0,
            cleanerUser: user.cleanerUser || 0
          };
        } else {
          console.warn('User ID is undefined');
        }
      });
    });
  }

  loadCosmeticsForTaskie(): void {
    this.taskieService.getCosmeticsForTaskie(this.taskie.id).subscribe(cosmetics => {
      this.cosmetics = cosmetics.filter(cosmetic => {
        const cosmeticId = cosmetic.id ?? 0; 
        return this.isEvolved ? cosmeticId >= 3 : cosmeticId < 3;
      });
    });
  }

  updateExperienceAndLevel(): void {
    const experience = this.taskie.experience ?? 0;
    const valueLevel = this.taskie.lvlTaskie?.value ?? 1;
    this.calculateProgressTaskie(experience, valueLevel);

  }
  
  calculateProgressTaskie(experience: number, level: number): void {
    const percentage = (experience / level) * 100;
    this.progressPercentage = percentage.toFixed(2) + "%";
  }

  onCosmeticClick(cosmetic: ICosmetic): void {
    if (this.appliedCosmetic && this.appliedCosmetic.id === cosmetic.id) {
      return; 
    }
    this.applyCosmetic(cosmetic);
  }
applyCosmetic(cosmetic: ICosmetic): void {
  this.appliedCosmetic = cosmetic;
  this.selectedCosmeticSprite = cosmetic.sprite;


  setTimeout(() => {
      this.selectedCosmeticSprite = cosmetic.sprite;
  }, 0);
}

removeAppliedCosmetic(): void {
  this.appliedCosmetic = null;
  this.selectedCosmeticSprite = undefined;
}

  onDragStart(event: DragEvent, interactable: IInteractable): void {
    event.dataTransfer?.setData('application/json', JSON.stringify(interactable));
    this.dragImage = new Image();
    this.dragImage.src = interactable.sprite;
    this.dragImage.style.width = '50px';
    this.dragImage.style.height = '50px';
    document.body.appendChild(this.dragImage);
    event.dataTransfer?.setDragImage(this.dragImage, 25, 25);
  }

  onDragEnd(event: DragEvent): void {
    if (this.dragImage) {
      document.body.removeChild(this.dragImage);
      this.dragImage = null;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      const interactable: IInteractable = JSON.parse(data);

      if (this.interactableChck(interactable)) {
        this.taskieService.applyInteractable(this.taskie.id, interactable.id).subscribe({
          next: (updatedTaskie: ITaskie) => {
            this.updateUserInteractable(interactable);
            this.toastSvc.success(this.feedbackMessage.message, "Taskie Updated!");
            this.taskie = updatedTaskie;
          },
          error: (error) => {
            this.toastSvc.error("Error applying the cosmetic", error);
          }
        });
      } else {
        this.toastSvc.warning(
          "You don't have enough " + interactable.name + "!",
          "Hey!"
        );
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  goBack(){
    this.location.back();
  }

  updateUserInteractable(interactable: IInteractable): void {
    if (interactable.name === 'FOOD') {
      this.userDTO.foodUser = (this.userDTO.foodUser || 0) - 1;
    } else if (interactable.name === 'SHAMPOO') {
      this.userDTO.cleanerUser = (this.userDTO.cleanerUser || 0) - 1;
    }
    this.userService.updateUserSignal(this.userDTO).subscribe({
      next: () => {
        console.log('User updated successfully');
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  interactableChck(interactable: IInteractable): boolean {
    if (interactable.name === 'FOOD' && this.userDTO.foodUser !== undefined && this.userDTO.foodUser <= 0) {
      return false;
    } else if (interactable.name === 'SHAMPOO' && this.userDTO.cleanerUser !== undefined && this.userDTO.cleanerUser <= 0) {
      return false;
    } else {
      return true;
    }
  }
}
