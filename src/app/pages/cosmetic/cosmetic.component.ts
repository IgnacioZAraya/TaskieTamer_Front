import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CosmeticListComponent } from '../../components/cosmetic/cosmetic-list/cosmetic-list.component';
import { CosmeticFormComponent } from "../../components/cosmetic/cosmetic-form/cosmetic-form.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-cosmetic',
  standalone: true,
  imports: [
    CosmeticListComponent,
    CosmeticFormComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule,
  ],
  templateUrl: './cosmetic.component.html',
  styleUrl: './cosmetic.component.scss'
})
export class CosmeticComponent {

}
