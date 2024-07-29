import { Component, effect, inject, Injector, Input, OnInit, runInInjectionContext, Renderer2 } from '@angular/core';
import { ICosmetic, IFeedBackMessage, ITaskie } from '../../../interfaces';
import { CommonModule, Location } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TaskieService } from '../../../services/taskie.service';
import { ActivatedRoute } from '@angular/router';
import { CosmeticService } from '../../../services/cosmetic.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-taskies-card',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule
  ],
  templateUrl: './taskies-card.component.html',
  styleUrls: ['./taskies-card.component.scss']
})
export class TaskieViewComponent implements OnInit {

  @Input() taskie!: ITaskie;
  cosmetics: ICosmetic[] = [];
  private dragImage: HTMLImageElement | null = null;
  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  private injector = inject(Injector);
  toastSvc = inject(ToastrService);

  constructor(
    private route: ActivatedRoute,
    private taskieService: TaskieService,
    private cosmeticService: CosmeticService,
    private renderer: Renderer2,
    private location: Location
  ) {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.cosmetics = this.cosmeticService.cosmetics$();
    
      });
    });
  }

  ngOnInit(): void {
    const taskieId = +this.route.snapshot.paramMap.get('id')!;
    this.taskieService.getAllSignal();
    this.cosmeticService.getAllSignal();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const taskies = this.taskieService.taskies$();
        this.taskie = taskies.find(t => t.id === taskieId) || {} as ITaskie;
       
      });
    });
  }
  onDragStart(event: DragEvent, cosmetic: ICosmetic): void {
    event.dataTransfer?.setData('application/json', JSON.stringify(cosmetic));
    console.log('Drag started:', cosmetic);

    this.dragImage = new Image();
    this.dragImage.src = cosmetic.sprite;
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
      const cosmetic: ICosmetic = JSON.parse(data);
      console.log('Dropped cosmetic:', cosmetic);

      this.taskieService.applyCosmetic(this.taskie.id, cosmetic.id).subscribe({
        next: (updatedTaskie: ITaskie) => {
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
}