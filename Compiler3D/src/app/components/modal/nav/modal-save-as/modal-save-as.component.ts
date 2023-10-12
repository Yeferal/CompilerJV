import { Component } from '@angular/core';
import { NodeDir, actualProject } from 'src/app/core/models/NodeDir';

@Component({
  selector: 'app-modal-save-as',
  templateUrl: './modal-save-as.component.html',
  styleUrls: ['./modal-save-as.component.scss']
})
export class ModalSaveAsComponent {

  isOpen: boolean = false;
  listProjects: Array<NodeDir> = [actualProject]

  resetData(){
    //Reset de los datos del modal, en este caso el formulario
    // this.form.reset();
  }

  openModal(){
    this.resetData();
    this.isOpen = true;
  }

  receiveCloseModal($event: boolean) {
    this.isOpen = $event;
  }

  sendData(){
    // this.isSend = true;
    // if (this.form.valid) {
    //   console.log(this.form.value);
    // }
    
    
  }

}
