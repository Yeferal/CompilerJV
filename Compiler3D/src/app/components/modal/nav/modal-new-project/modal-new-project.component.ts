import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from 'src/app/services/files.service';
import { ShareProjectService } from 'src/app/services/share-project.service';
import { ModalComponent } from '../../modal.component';
import { FileProject } from 'src/app/core/models/FileProject';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { Folder } from 'src/app/core/models/Folder';
import { Project } from 'src/app/core/models/Project';
import { transformContentProject, transformProject } from 'src/app/core/Global/transform';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(private filesService: FilesService, 
    private shareProjectService: ShareProjectService,
    private cookieService: CookieService){

  }

  ngOnInit(){
    // console.log("Monto Init");
    
  }

  ngOnDestroy(): void {
    // console.log("Desmonto Destroy");
    
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

  sendData(modal: ModalComponent){
    this.isSend = true;
    if (this.form.invalid) {
      return;
    }
    
    this.filesService.postProject(this.form.value).subscribe({
      next: res => {
        this.shareProjectService.setRoot(transformProject(res.data));
        this.shareProjectService.sendDataRoot(transformProject(res.data));
        this.cookieService.set("project", res.data.name);
        modal.closeModal();
      },
      error: err => {
        console.log(err);
        
      }
    })
    
  }
}
