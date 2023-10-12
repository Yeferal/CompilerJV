import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-new-file',
  templateUrl: './modal-new-file.component.html',
  styleUrls: ['./modal-new-file.component.scss']
})
export class ModalNewFileComponent {

  public form : FormGroup = new FormGroup({
    name: new FormControl(null,Validators.required)
  });

  isSend: boolean = false;
  isOpen: boolean = false;

  resetData(){
    //Reset de los datos del modal, en este caso el formulario
    this.form.reset();
  }

  openModal(){
    this.resetData();
    this.isOpen = true;
  }

  receiveCloseModal($event: boolean) {
    this.isOpen = $event;
  }

  sendData(){
    this.isSend = true;
    if (this.form.valid) {
      console.log(this.form.value);
    }
    
    
  }
}
