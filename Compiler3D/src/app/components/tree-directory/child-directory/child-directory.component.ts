import { Component, Input } from '@angular/core';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { faFolderOpen, faFolderClosed, faAngleRight, faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { ShareDirService } from 'src/app/services/share-dir.service';

@Component({
  selector: 'app-child-directory',
  templateUrl: './child-directory.component.html',
  styleUrls: ['./child-directory.component.scss']
})
export class ChildDirectoryComponent {
  @Input() data: NodeDir;
  faDirOpenIcon = faFolderOpen;
  faDirCloseIcon = faFolderClosed;
  faDirArrowOpen = faAngleDown;
  faDirArrowClose = faAngleRight;

  show: boolean = true;

  constructor(private shareDirService: ShareDirService){}

  showContent(){
    this.show = !this.show;
    this.shareDirService.sendNodeData(this.data);
  }

  hideContent(){
    this.show = false;
  }
}
