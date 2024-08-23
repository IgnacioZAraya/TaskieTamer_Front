import { Component } from '@angular/core';
import { UserLevelFormComponent } from '../../components/user-level/user-level-form/user-level-form.component';
import { UserLevelListComponent } from '../../components/user-level/user-level-list/user-level-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-user-level',
  standalone: true,
  imports: [
    UserLevelFormComponent,
    UserLevelListComponent,
    LoaderComponent,
    ModalComponent,
    CommonModule,
  ],
  templateUrl: './user-level.component.html',
  styleUrl: './user-level.component.scss'
})
export class UserLevelComponent {

}
