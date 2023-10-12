import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-open-project',
  templateUrl: './modal-open-project.component.html',
  styleUrls: ['./modal-open-project.component.scss']
})
export class ModalOpenProjectComponent {

  isOpen: boolean = false;

  openModal(){
    this.isOpen = true;
  }

  receiveCloseModal($event: boolean) {
    this.isOpen = $event;
  }
}
