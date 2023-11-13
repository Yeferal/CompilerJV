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
import { MainNode } from 'src/app/core/models/ast/main/instructions/main-node';
import { ModalComponent } from '../modal/modal.component';
import { DataFactory } from 'src/app/core/models/ast/main/tree/Factory';
import { GeneratedService } from 'src/app/services/generated.service';
import { SectionService } from 'src/app/services/section.service';

@Component({
  selector: 'app-tree-directory',
  templateUrl: './tree-directory.component.html',
  styleUrls: ['./tree-directory.component.scss']
})
export class TreeDirectoryComponent {
  compiledFile: Blob | null = null;
  projectsNow: NodeDir;
  listMains: Array<MainNode> = [];
  isOpen: boolean = false;
  isOpenError: boolean = false;
  msgError = "";
  dataFactory: DataFactory;
  // 0: code 3d
  // 1: downloada code 3d
  // 2: code assm
  // 3: downloada assm 3d
  typeApi = 0; 

  handlerCompiler = new HandlerCompiler(this.shareCodeEditorService, this);

  constructor(private filesService: FilesService, 
    private shareProjectService: ShareProjectService, 
    private cookieService: CookieService, 
    private shareCodeEditorService: ShareCodeEditorService, 
    private generatedService: GeneratedService, 
    private sectionService: SectionService ){
      this.shareProjectService.dataRoot$.subscribe({
        next: (root) => {
          this.projectsNow = root;
        }
      });

      this.filesService.dataGen3D$.subscribe({
        next: res => {
          this.typeApi = 0;
          this.generateCode3D();
        }
      });

      this.filesService.dataGenAssem$.subscribe({
        next: res => {
          this.typeApi = 2;
          this.generateCode3D();
        }
      });

      this.filesService.dataDow3D$.subscribe({
        next: res => {
          this.typeApi = 1;
          this.generateCode3D();
        }
      });

      this.filesService.dataDowAssem$.subscribe({
        next: res => {
          this.typeApi = 3;
          this.generateCode3D();
        }
      });
    }

  ngOnInit() {
    this.verifyOpenProject();
  }

  receiveCloseModal($event: boolean) {
    this.isOpen = $event;
  }

  openModal(){
    this.isOpen = true;
  }

  openModalError(msg: string){
    this.msgError = msg;
    this.isOpenError = true;
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

          // this.generateCode3D();
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

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
    this.handlerCompiler = new HandlerCompiler(this.shareCodeEditorService, this);
    this.handlerCompiler.compiler(list);
    if (this.dataFactory.handlerComprobation.listMain.length == 0) {
      //Enviar de una vez 
      this.sendApi();
    }
  }

  sendMain(i: number, modalChild: ModalComponent){
    modalChild.closeModal();    
    this.handlerCompiler.compiler3D(this.listMains[i], this.dataFactory);
    this.sendApi();
  }

  sendApi(){
    switch(this.typeApi){
      case 0:
        this.sendGenCode3D();
        break;
      case 1:
        this.downloadCode3D();
        break;
      case 2:
        this.generateCodeAssem();
        break;
      case 3:
        this.downloadCodeAssem();
        break;
    }
  }

  sendGenCode3D(){
    if (this.projectsNow == null) {
      return ;
    }
    const data = {
      listQuartet: this.dataFactory.environment.handlerQuartet.listQuartet,
      listInt: this.dataFactory.environment.handlerQuartet.listTempsInt,
      listFloat: this.dataFactory.environment.handlerQuartet.listTempsFloat,
      listString: this.dataFactory.environment.handlerQuartet.listTempsString,
      listVoid: this.dataFactory.environment.handlerQuartet.listVoid,
    }
    
    this.generatedService.postGenTreeDir(data).subscribe({
      next: res => {
        this.sectionService.setText3D(res.data.text);
        this.sectionService.sendData3dTxt(res.data.text);
        this.sectionService.sendData(2);
      }, error: err => {
        console.log(err);
        
      }
    });
    
  }

  generateCodeAssem(){
    if (this.projectsNow == null) {
      return ;
    }
    const data = {
      listQuartet: this.dataFactory.environment.handlerQuartet.listQuartet,
      listInt: this.dataFactory.environment.handlerQuartet.listTempsInt,
      listFloat: this.dataFactory.environment.handlerQuartet.listTempsFloat,
      listString: this.dataFactory.environment.handlerQuartet.listTempsString,
      listVoid: this.dataFactory.environment.handlerQuartet.listVoid
    }

    this.generatedService.postGenTreeAssm(data).subscribe({
      next: res => {
        this.sectionService.setTextAssm(res.data.text);
        this.sectionService.sendDataAssmTxt(res.data.text);
        this.sectionService.sendData(4);
      }, error: err => {
        console.log(err);
        
      }
    });
    
  }

  downloadCode3D(){
    console.log("Asdfasdfasd");
    
    if (this.projectsNow == null) {
      return ;
    }
    const data = {
      listQuartet: this.dataFactory.environment.handlerQuartet.listQuartet,
      listInt: this.dataFactory.environment.handlerQuartet.listTempsInt,
      listFloat: this.dataFactory.environment.handlerQuartet.listTempsFloat,
      listString: this.dataFactory.environment.handlerQuartet.listTempsString,
      listVoid: this.dataFactory.environment.handlerQuartet.listVoid
    }
    // this.generatedService.postDownTreeDir(data).subscribe(
    //   (response) => {
    //     const blob = response.body as Blob;
    //     const contentDispositionHeader = response.headers.get('content-disposition');
    //     const filenameMatch = contentDispositionHeader?.match(/filename="(.+)"$/);
    //     const filename = filenameMatch ? filenameMatch[1] : 'main';

    //     // Agrega la extensión .c al nombre del archivo
    //     const filenameWithExtension = filename + '';

    //     // Crear un enlace para la descarga
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', filenameWithExtension);

    //     // Simular un clic en el enlace para iniciar la descarga
    //     document.body.appendChild(link);
    //     link.click();

    //     // Limpiar después de la descarga
    //     document.body.removeChild(link);
    //   },
    //   (error) => {
    //     console.error('Error en la solicitud POST:', error);
    //   }
    // );

    this.generatedService.postDownTreeDir(data).subscribe(
      (response) => {
        const blob = response.body as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'codigo.c');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('Error en la descarga del archivo:', error);
      }
    );
    
  }

  downloadCodeAssem(){
    if (this.projectsNow == null) {
      return ;
    }
    const data = {
      listQuartet: this.dataFactory.environment.handlerQuartet.listQuartet,
      listInt: this.dataFactory.environment.handlerQuartet.listTempsInt,
      listFloat: this.dataFactory.environment.handlerQuartet.listTempsFloat,
      listString: this.dataFactory.environment.handlerQuartet.listTempsString,
      listVoid: this.dataFactory.environment.handlerQuartet.listVoid
    }
    this.generatedService.postDownTreeAssm(data).subscribe({
      next: res => {
        console.log(res);
      }, error: err => {
        console.log(err);
        
      }
    });
    
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
