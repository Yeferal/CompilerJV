import { Component, Input } from '@angular/core';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { faCoffee, faFileLines, faFileAlt, faFileCode, faCode, faCodeCompare, faLaptopCode, faMicrochip, faFile } from '@fortawesome/free-solid-svg-icons';
import { ShareDirService } from 'src/app/services/share-dir.service';

@Component({
  selector: 'app-child-file',
  templateUrl: './child-file.component.html',
  styleUrls: ['./child-file.component.scss']
})
export class ChildFileComponent {
  @Input() data: NodeDir;
  faFileIcon = faFile;


  constructor(private shareDirService: ShareDirService){}

  setSelected(){
    this.shareDirService.sendNodeData(this.data);
  }

  openFile(){
    // console.log(this.data);
    if (this.data.active) {
      this.data.selected = true;
    } else {
      this.data.active = true;
      this.data.selected = true;
    }
  }
}
