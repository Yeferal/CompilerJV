import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faFile, faFolderClosed } from '@fortawesome/free-solid-svg-icons';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { FilesService } from 'src/app/services/files.service';
import { ShareDirService } from 'src/app/services/share-dir.service';
import { ModalComponent } from '../../modal.component';
import { transformProject } from 'src/app/core/Global/transform';
import { ShareProjectService } from 'src/app/services/share-project.service';

@Component({
  selector: 'app-modal-new-file',
  templateUrl: './modal-new-file.component.html',
  styleUrls: ['./modal-new-file.component.scss']
})
export class ModalNewFileComponent {
  actualDir: NodeDir;
  faDirCloseIcon = faFolderClosed;
  faFileIcon = faFile;
  isFile: boolean = true;

  public form : FormGroup = new FormGroup({
    name: new FormControl(null,Validators.required)
  });

  isSend: boolean = false;
  isOpen: boolean = false;

  constructor(private filesService: FilesService, 
    private shareDirService: ShareDirService,
    private shareProjectService: ShareProjectService ){
    this.shareDirService.dataNode$.subscribe({
      next: data => {
        this.actualDir = data;
      }
    });
  }

  resetData(){
    //Reset de los datos del modal, en este caso el formulario
    this.form.reset();
    this.isFile = true;
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
    if (this.form.invalid && !this.actualDir) {
      return;
    }
    if (this.isFile) {
      this.newFile(modal);
    } else {
      this.newDir(modal);
    }
    
  }

  newFile(modal: ModalComponent){
    const data = {
      name: this.form.get("name").value+".java",
      path: this.actualDir.path,
      pathArray: this.actualDir.pathArray
    }
    this.filesService.postFile(data).subscribe({
      next: res => {
        console.log(res);
        this.shareProjectService.setRoot(transformProject(res.data));
        this.shareProjectService.sendDataRoot(transformProject(res.data));
        modal.closeModal();
      },
      error: err => {
        console.log(err);
        
      }
    });
  }

  newDir(modal: ModalComponent){
    const data = {
      name: this.form.get("name").value,
      path: this.actualDir.path,
      pathArray: this.actualDir.pathArray
    }
    this.filesService.postDir(data).subscribe({
      next: res => {
        console.log(res);
        this.shareProjectService.setRoot(transformProject(res.data));
        this.shareProjectService.sendDataRoot(transformProject(res.data));
        modal.closeModal();
      },
      error: err => {
        console.log(err);
        
      }
    });
  }

  getStringPath(): string{
    let text = "";
    for (let i = 0; i < this.actualDir.pathArray.length; i++) {
      if (i == this.actualDir.pathArray.length-1) {
        text += this.actualDir.pathArray[i]
      }else{
        text += this.actualDir.pathArray[i]+"."
      }
    }
    return text;
  }

  setIsFile(value: boolean){
    this.isFile = value;
  }
}
