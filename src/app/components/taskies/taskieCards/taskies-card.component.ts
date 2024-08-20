import { ProfileService } from './../../../services/profile.service';
import { Component, effect, inject, Injector, Input, OnInit, runInInjectionContext, Renderer2 } from '@angular/core';
import { IInteractable, IFeedBackMessage, ITaskie, IUser, IUserSpec } from '../../../interfaces';
import { CommonModule, Location } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskieService } from '../../../services/taskie.service';
import { ActivatedRoute } from '@angular/router';
import { InteractableService } from '../../../services/interactable.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from '@angular/cdk/dialog';
import { UserService } from '../../../services/user.service';


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
  private dragImage: HTMLImageElement | null = null;
  feedbackMessage: IFeedBackMessage = { message: "" };

  private injector = inject(Injector);
  public profileService = inject(ProfileService);
  public userSpec!: IUserSpec;
  toastSvc = inject(ToastrService);
  public userService = inject(UserService);

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
    this.loadUserSpec();
    const taskieId = +this.route.snapshot.paramMap.get('id')!;
    this.taskieService.getAllSignal();
    this.interactableService.getAllSignal();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const taskies = this.taskieService.taskies$();
        this.taskie = taskies.find(t => t.id === taskieId) || {} as ITaskie;
        this.profileService.getLoggedUserInfo();
      });
    });
  }

  loadUserSpec(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const user = this.profileService.user$();
        if (user && user.id) {
          this.userSpec = {
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
        this.taskieService.applyCosmetic(this.taskie.id, interactable.id).subscribe({
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
      this.userSpec.foodUser = (this.userSpec.foodUser || 0) - 1;
    } else if (interactable.name === 'SHAMPOO') {
      this.userSpec.cleanerUser = (this.userSpec.cleanerUser || 0) - 1;
    }
    this.userService.updateUserSignal(this.userSpec).subscribe({
      next: () => {
        console.log('User updated successfully');
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  interactableChck(interactable: IInteractable): boolean {
    if (interactable.name === 'FOOD' && this.userSpec.foodUser !== undefined && this.userSpec.foodUser <= 0) {
      return false;
    } else if (interactable.name === 'SHAMPOO' && this.userSpec.cleanerUser !== undefined && this.userSpec.cleanerUser <= 0) {
      return false;
    } else {
      return true;
    }
  }
}