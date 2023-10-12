import { Component, Input } from '@angular/core';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { faFolderOpen, faFolderClosed, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-child-directory',
  templateUrl: './child-directory.component.html',
  styleUrls: ['./child-directory.component.scss']
})
export class ChildDirectoryComponent {
  @Input() data: NodeDir;
  faDirOpenIcon = faFolderOpen;
  faDirCloseIcon = faFolderClosed;
  faDirArrowOpen = faAngleRight;
  faDirArrowClose = faAngleLeft;
}
