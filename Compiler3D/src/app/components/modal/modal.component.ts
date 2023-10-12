import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isShowModal: boolean = false;
  @Input() titleModal: String = "";
  @Output() closeModalMsg = new EventEmitter<boolean>();

  constructor(){}

  ngOnInit() {

  }

  openModal(){
    this.isShowModal = true;
    this.sendOpenModal();
  }

  closeModal(){
    this.isShowModal = false;
    this.sendCloseModal();
  }

  sendCloseModal() {
    this.closeModalMsg.emit(false);
  }

  sendOpenModal() {
    this.closeModalMsg.emit(true);
  }

}
