import { Component } from '@angular/core';
import { Project } from 'src/app/core/models/Project';
import { FilesService } from 'src/app/services/files.service';
import { ShareProjectService } from 'src/app/services/share-project.service';
import { ModalComponent } from '../../modal.component';
import { transformProject } from 'src/app/core/Global/transform';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-modal-open-project',
  templateUrl: './modal-open-project.component.html',
  styleUrls: ['./modal-open-project.component.scss']
})
export class ModalOpenProjectComponent {

  listProjects: Array<Project> = [];
  isOpen: boolean = false;

  constructor(private filesService: FilesService, 
    private shareProjectService: ShareProjectService, 
    private cookieService: CookieService){}

  openModal(){
    this.isOpen = true;
    this.updateList();
  }

  receiveCloseModal($event: boolean) {
    this.isOpen = $event;
  }

  updateList(){
    this.filesService.getProjects().subscribe({
      next: res => {
        this.listProjects = res.data;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  openProject(id: number, modal: ModalComponent){
    this.filesService.getProject(this.listProjects[id].name).subscribe({
      next: res => {
        this.shareProjectService.setRoot(transformProject(res.data));
        this.shareProjectService.sendDataRoot(transformProject(res.data));
        this.cookieService.set("project", res.data.name);
        modal.closeModal();
      },
      error: err => {
        console.log(err);
        
      }
    });
  }
}
