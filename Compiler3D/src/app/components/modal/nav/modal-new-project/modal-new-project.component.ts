import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-new-project',
  templateUrl: './modal-new-project.component.html',
  styleUrls: ['./modal-new-project.component.scss']
})
export class ModalNewProjectComponent implements OnInit, OnDestroy {
  
  public form : FormGroup = new FormGroup({
    name: new FormControl(null,Validators.required)
  });

  isSend: boolean = false;
  isOpen: boolean = false;

  ngOnInit(){
    console.log("Monto Init");
    
  }

  ngOnDestroy(): void {
    console.log("Desmonto Destroy");
    
  }

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
