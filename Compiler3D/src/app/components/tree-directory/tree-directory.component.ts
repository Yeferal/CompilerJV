import { Component } from '@angular/core';
import { NodeDir, actualProject } from 'src/app/core/models/NodeDir';

@Component({
  selector: 'app-tree-directory',
  templateUrl: './tree-directory.component.html',
  styleUrls: ['./tree-directory.component.scss']
})
export class TreeDirectoryComponent {
  listProjects: Array<NodeDir> = [actualProject]

  ngOnInit() {
    
  }
}
