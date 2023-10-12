import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-open-file',
  templateUrl: './modal-open-file.component.html',
  styleUrls: ['./modal-open-file.component.scss']
})
export class ModalOpenFileComponent {

  isOpen: boolean = false;

  openModal(){
    this.isOpen = true;
  }

  receiveCloseModal($event: boolean) {
    this.isOpen = $event;
  }
}
