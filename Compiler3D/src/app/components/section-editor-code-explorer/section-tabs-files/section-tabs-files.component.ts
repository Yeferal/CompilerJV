import { Component, HostListener, OnInit } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { FilesService } from 'src/app/services/files.service';
import { SectionService } from 'src/app/services/section.service';
import { ShareCodeEditorService } from 'src/app/services/share-code-editor.service';
import { ShareDirService } from 'src/app/services/share-dir.service';
import { ShareProjectService } from 'src/app/services/share-project.service';

@Component({
  selector: 'app-section-tabs-files',
  templateUrl: './section-tabs-files.component.html',
  styleUrls: ['./section-tabs-files.component.scss']
})
export class SectionTabsFilesComponent implements OnInit {
  @HostListener('wheel', ['$event']) onMouseWheel(event: WheelEvent): void {
    // Ajustar el desplazamiento horizontal al girar la rueda del ratón
    const tabsContainer = event.currentTarget as HTMLElement;
    tabsContainer.scrollLeft += event.deltaY;
    event.preventDefault();
  }
  

  fileSelected: NodeDir;
  listTabs: Array<NodeDir> = [];
  flagIndex = 0;


  constructor(private shareCodeEditorService: ShareCodeEditorService, 
    private sectionService: SectionService, 
    private shareProject: ShareProjectService,
    private shareDirService: ShareDirService, 
    private filesService: FilesService) {

      shareDirService.dataNodeFile$.subscribe({
        next: (res) => {
          this.searchIsExisteNode(res);
        }
      });

      shareProject.dataActual$.subscribe({
        next: res => {
          if (res == null) {
            this.listTabs = this.shareProject.getTabs();
          }
          
        }
      });

      shareProject.dataSave$.subscribe({
        next: res => {
          this.updateSave(res);
        }
      });

      shareProject.dataSaveAs$.subscribe({
        next: res => {
          this.postSaveAs(res);
        }
      });
  }

  ngOnInit(): void {
    this.listTabs = this.shareProject.getTabs();
  }

  searchIsExisteNode(node: NodeDir){
    let isExist = false;
    for (let i = 0; i < this.listTabs.length; i++) {
      if (node.name === this.listTabs[i].name && node.path === this.listTabs[i].path) {
        this.listTabs[this.flagIndex].selected = false;
        this.listTabs[i].selected = true;
        isExist = true;
        this.flagIndex = i;
        this.shareProject.sendDataActual(this.listTabs[this.flagIndex]);
      }
    }


    if (!isExist) {
      if (this.listTabs.length>0) {
        this.listTabs[this.flagIndex].selected = false;
      }
      node.selected = true;
      this.listTabs.push(node);
      this.flagIndex = this.listTabs.length-1;
      this.getTextNode(node);
    }
    
  }

  setSelecteNode(index: number){
    this.listTabs[this.flagIndex].selected = false;
    this.listTabs[index].selected = true;
    this.flagIndex = index;
    // this.shareProject.setActualNode(this.listTabs[this.flagIndex]);
    this.shareProject.sendDataActual(this.listTabs[this.flagIndex]);
  }

  getTextNode(node: NodeDir){
    this.filesService.getFileContent(node.path).subscribe({
      next: res => {
        this.listTabs[this.flagIndex].text = res.data;
        this.shareProject.sendDataActual(this.listTabs[this.flagIndex]);
      }
    });
  }

  updateSave(res: boolean){
    if (!this.listTabs[this.flagIndex].update) {
      return;
    }
    
    this.filesService.putContetFile({path: this.listTabs[this.flagIndex].path, text: this.listTabs[this.flagIndex].text}).subscribe({
      next: res => {
        this.listTabs[this.flagIndex].update = false;
      },
      error: err => {
        console.log(err);
        
      }
    });
  }

  postSaveAs(res: boolean){
    
  }

}
