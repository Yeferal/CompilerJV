import { Component } from '@angular/core';
import { FileProject } from 'src/app/core/models/FileProject';
import { Folder } from 'src/app/core/models/Folder';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { Project } from 'src/app/core/models/Project';
import { FilesService } from 'src/app/services/files.service';
import { ShareProjectService } from 'src/app/services/share-project.service';
import { CookieService } from 'ngx-cookie-service';
import { transformProject } from 'src/app/core/Global/transform';

@Component({
  selector: 'app-tree-directory',
  templateUrl: './tree-directory.component.html',
  styleUrls: ['./tree-directory.component.scss']
})
export class TreeDirectoryComponent {
  projectsNow: NodeDir;

  constructor(private filesService: FilesService, 
    private shareProjectService: ShareProjectService, 
    private cookieService: CookieService){
      this.shareProjectService.dataRoot$.subscribe({
        next: (root) => {
          this.projectsNow = root;
        }
      });
    }

  ngOnInit() {
    this.verifyOpenProject();
    
  }

  getLibrary(){
    this.filesService.getLibrary().subscribe({
      next: res => {
        console.log(res.data);
      },
      error: err => {
        console.error(err);
        
      }
    });
  }

  verifyOpenProject(){
    const cookie = this.cookieService.get("project");
    
    if (cookie && cookie!="") {
      this.filesService.getProject(cookie).subscribe({
        next: res => {
          console.log(res.data);
          const newRoot = transformProject(res.data as Project);
          console.log(newRoot);
          
          this.shareProjectService.setRoot(newRoot);
          this.shareProjectService.sendDataRoot(newRoot);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

}
