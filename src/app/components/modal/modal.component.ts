import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: `
    <ng-template #modal >
      <div class="base-modal">
        <button type="button" (click)="hide()" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styleUrl: "./modal.component.scss"
})
export class ModalComponent {
  @Input() size?: string;
  @Input() title?: string;
  @ViewChild('modal') modal: any;
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  public show() {
    this.modalRef = this.modalService.open(this.modal, {
      ariaLabelledBy: 'modal-component',
      centered: true,
      size: this.size ?? 'md',
    });
  }

  public hide() {
    this.modalRef?.dismiss();
  }

}
