import {
  Component,
  effect,
  inject,
  Injector,
  Input,
  OnInit,
  runInInjectionContext,
  Renderer2,
} from "@angular/core";
import {
  ICosmetic,
  IFeedBackMessage,
  ITaskie,
  IUser,
} from "../../../interfaces";
import { CommonModule, Location } from "@angular/common";
import { DragDropModule, CdkDragDrop } from "@angular/cdk/drag-drop";
import { TaskieService } from "../../../services/taskie.service";
import { ActivatedRoute } from "@angular/router";
import { CosmeticService } from "../../../services/cosmetic.service";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "../../../services/profile.service";

@Component({
  selector: "app-taskies-card",
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: "./taskies-card.component.html",
  styleUrls: ["./taskies-card.component.scss"],
})
export class TaskieViewComponent implements OnInit {
  private injector = inject(Injector);
  userSvc = inject(ProfileService);
  toastSvc = inject(ToastrService);

  @Input() taskie!: ITaskie;
  cosmetics: ICosmetic[] = [];
  private dragImage: HTMLImageElement | null = null;
  feedbackMessage: IFeedBackMessage = {
    message: "",
  };

  public food?: number;
  public cleaner?: number;

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
    const taskieId = +this.route.snapshot.paramMap.get("id")!;
    this.taskieService.getAllSignal();
    this.cosmeticService.getAllSignal();
    this.food = this.userSvc.user$().foodUser;
    this.cleaner = this.userSvc.user$().cleanerUser;
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const taskies = this.taskieService.taskies$();
        this.taskie = taskies.find((t) => t.id === taskieId) || ({} as ITaskie);
      });
    });

    console.log(this.food);
  }
  onDragStart(event: DragEvent, cosmetic: ICosmetic): void {
    event.dataTransfer?.setData("application/json", JSON.stringify(cosmetic));

    this.dragImage = new Image();
    this.dragImage.src = cosmetic.sprite;
    this.dragImage.style.width = "50px";
    this.dragImage.style.height = "50px";
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

    const data = event.dataTransfer?.getData("application/json");
    if (data) {
      const cosmetic: ICosmetic = JSON.parse(data);
      let checked: boolean = true;
      checked = this.interactableChck(cosmetic);
      if (checked) {
        this.taskieService
          .applyCosmetic(this.taskie.id, cosmetic.id)
          .subscribe({
            next: (updatedTaskie: ITaskie) => {
              this.toastSvc.success(
                this.feedbackMessage.message,
                "Taskie Updated!"
              );
              this.interactableUpdt(cosmetic);
              this.taskie = updatedTaskie;
            },
            error: (error) => {
              this.toastSvc.success(this.feedbackMessage.message, "Error!");
            },
          });
      } else {
        this.toastSvc.warning(
          "You don´t have enough " + cosmetic.name + "!",
          "Hey!"
        );
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  goBack() {
    this.location.back();
  }

  interactableUpdt(cosmetic: ICosmetic): void {
    if (cosmetic.name === "FOOD" && this.food != undefined) {
      this.food = this.food - 1;
    } else if (cosmetic.name === "SHAMPOO" && this.cleaner != undefined) {
      this.cleaner = this.cleaner - 1;
    }
  }

  interactableChck(cosmetic: ICosmetic): boolean {
    if (cosmetic.name === "FOOD" && this.food != undefined && this.food <= 0) {
      return false;
    } else if (
      cosmetic.name === "SHAMPOO" &&
      this.cleaner != undefined &&
      this.cleaner <= 0
    ) {
      return false;
    } else {
      return true;
    }
  }
}
