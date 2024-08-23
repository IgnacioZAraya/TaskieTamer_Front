import { Component, effect, inject } from '@angular/core';
import { CosmeticFormComponent } from '../cosmetic-form/cosmetic-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { ModalComponent } from '../../modal/modal.component';
import { ICosmetic } from '../../../interfaces';
import { CosmeticService } from '../../../services/cosmetic.service';

@Component({
  selector: 'app-cosmetic-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    CosmeticFormComponent,
    ConfirmationComponent,
    MatSnackBarModule
  ],
  templateUrl: './cosmetic-list.component.html',
  styleUrl: './cosmetic-list.component.scss'
})
export class CosmeticListComponent {
  public search: String = '';
  public cosmeticList: ICosmetic[] = [];
  private service = inject(CosmeticService);
  public currentCosmetic: ICosmetic = {
    sprite: '',
    name: ''
  };
  
  constructor() {
    this.service.getAllSignal();
    effect(() => {      
      this.cosmeticList = this.service.cosmetics$();
    });
  }

  showDetail(cosmetic: ICosmetic, modal: any) {
    this.currentCosmetic = {...cosmetic}; 
    modal.show();
  }

  showConfirmation(cosmetic: ICosmetic, modal: any) {
    this.currentCosmetic = {...cosmetic}; 
    modal.show();
  }
}
