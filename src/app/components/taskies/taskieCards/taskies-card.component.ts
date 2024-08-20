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
  @Input() taskie!: ITaskie;
  interactables: IInteractable[] = [];
  private dragImage: HTMLImageElement | null = null;
  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  private injector = inject(Injector);
  public profileService = inject(ProfileService);
  toastSvc = inject(ToastrService);

  public userSpec : IUserSpec = {
    email: "",
    lastname: "",
    password: "",
    name: "",
  };

  public taskieImg!: string;


  constructor(
    private route: ActivatedRoute,
    private taskieService: TaskieService,
    private interactableService: InteractableService,
    private renderer: Renderer2,
    private location: Location,
 
  ) 
  
  
  {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.interactables = this.interactableService.interactables$();
    
      });
    });

  }

  ngOnInit(): void {
    const taskieId = +this.route.snapshot.paramMap.get('id')!;
    this.taskieService.getAllSignal();
    this.interactableService.getAllSignal();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const taskies = this.taskieService.taskies$();
        this.taskie = taskies.find(t => t.id === taskieId) || {} as ITaskie;
       
      });
    });

    this.setTaskieImg(this.taskie);
  }
  onDragStart(event: DragEvent, interactable: IInteractable): void {
    event.dataTransfer?.setData('application/json', JSON.stringify(interactable));
    console.log('Drag started:', interactable);

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

      this.taskieService.applyCosmetic(this.taskie.id, interactable.id).subscribe({
        next: (updatedTaskie: ITaskie) => {
         this.updateUserInteractable(interactable);
          this.toastSvc.success(this.feedbackMessage.message, "Taskie Updated!");
          this.taskie = updatedTaskie;
        },
        error: (error) => {
          this.toastSvc.success(this.feedbackMessage.message, "Error!");
        }
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  goBack(){
    this.location.back();
  }

  updateUserInteractable(interactable: IInteractable): void {
    if(interactable.name == 'FOOD'){
      this.userSpec.foodUser = 100;
      console.log(this.userSpec.foodUser);
    }else{
      this.userSpec.cleanerUser = 100;
      console.log(this.userSpec.cleanerUser);
    }
  }

  setTaskieImg(taskie : ITaskie){
    if(taskie.evolved){
      this.taskieImg = taskie.specie.evolution;
      return;
    }

    this.taskieImg = taskie.specie.sprite;
  }
}
