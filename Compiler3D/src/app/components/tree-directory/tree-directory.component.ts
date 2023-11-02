import { Component } from '@angular/core';
import { FileProject } from 'src/app/core/models/FileProject';
import { Folder } from 'src/app/core/models/Folder';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { Project } from 'src/app/core/models/Project';
import { FilesService } from 'src/app/services/files.service';
import { ShareProjectService } from 'src/app/services/share-project.service';
import { CookieService } from 'ngx-cookie-service';
import { transformProject } from 'src/app/core/Global/transform';
import { HandlerCompiler } from 'src/app/core/models/ast/main/environment/handler-compiler';
import { firstValueFrom } from 'rxjs';
import { ShareCodeEditorService } from 'src/app/services/share-code-editor.service';

@Component({
  selector: 'app-tree-directory',
  templateUrl: './tree-directory.component.html',
  styleUrls: ['./tree-directory.component.scss']
})
export class TreeDirectoryComponent {
  projectsNow: NodeDir;

  constructor(private filesService: FilesService, 
    private shareProjectService: ShareProjectService, 
    private cookieService: CookieService, 
    private shareCodeEditorService: ShareCodeEditorService){
      this.shareProjectService.dataRoot$.subscribe({
        next: (root) => {
          this.projectsNow = root;
        }
      });

      this.filesService.dataGen3D$.subscribe({
        next: res => {
          this.generateCode3D();
        }
      });

      this.filesService.dataGenAssem$.subscribe({
        next: res => {
          this.generateCodeAssem();
        }
      });

      this.filesService.dataDow3D$.subscribe({
        next: res => {
          this.downloadCode3D();
        }
      });

      this.filesService.dataDowAssem$.subscribe({
        next: res => {
          this.downloadCodeAssem();
        }
      });
    }

  ngOnInit() {
    this.verifyOpenProject();
    // this.generateCode3D();
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
          // console.log(newRoot);
          
          this.shareProjectService.setRoot(newRoot);
          this.shareProjectService.sendDataRoot(newRoot);
          this.generateCode3D();
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  // generateCode3D(){
  //   if (this.projectsNow == null) {
  //     return ;
  //   }
  //   let listFile: Array<NodeDir> = [];
  //   this.colletPath(this.projectsNow, listFile);
  //   for (let i = 0; i < listFile.length; i++) {
  //     this.filesService.getFileContent(listFile[i].path).subscribe({
  //       next: res => {
  //         listFile[i].text = res.data;
  //       }
  //     });
  //   }
    
  //   this.compile3D(listFile);
    
  // }

  generateCode3D() {
    if (this.projectsNow == null) {
      return;
    }
  
    let listFile: Array<NodeDir> = [];
    this.colletPath(this.projectsNow, listFile);
  
    const fileRequests = listFile.map((file, i) =>
      // this.filesService.getFileContent(file.path).toPromise()
      firstValueFrom(this.filesService.getFileContent(file.path))
    );
  
    Promise.all(fileRequests)
      .then((fileContents) => {
        for (let i = 0; i < listFile.length; i++) {
          listFile[i].text = fileContents[i].data;
        }
        
        this.compile3D(listFile);
      })
      .catch((error) => {
        console.error("Error al obtener el contenido de los archivos: " + error);
      });
  }

  compile3D(list: Array<NodeDir>){
    const handlerCompiler = new HandlerCompiler(this.shareCodeEditorService);
    handlerCompiler.compiler(list);
  }

  generateCodeAssem(){
    if (this.projectsNow == null) {
      return ;
    }
    // let listPath: Array<NodeDir> = [];
    // this.colletPath(this.projectsNow, listPath);
    // console.log(listPath);
    
  }

  downloadCode3D(){
    if (this.projectsNow == null) {
      return ;
    }
    // let listPath: Array<NodeDir> = [];
    // this.colletPath(this.projectsNow, listPath);
    // console.log(listPath);
    
  }

  downloadCodeAssem(){
    if (this.projectsNow == null) {
      return ;
    }
    // let listPath: Array<NodeDir> = [];
    // this.colletPath(this.projectsNow, listPath);
    // console.log(listPath);
    
  }
  

  colletPath(node: NodeDir, list: Array<NodeDir>){
    if (node != null) {
      if (node.typeNode == "root") {
        for (let i = 0; i < node.nodeChilds.length; i++) {
          this.colletPath(node.nodeChilds[i], list);
        }
      } else if (node.typeNode == "directory") {
        for (let i = 0; i < node.nodeChilds.length; i++) {
          this.colletPath(node.nodeChilds[i], list);
        }
      } else {
        if (node.typeNode == "file") {
          list.push(node);
        }
      }
    }
  }


}
