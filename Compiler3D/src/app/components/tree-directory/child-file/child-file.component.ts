import { Component, Input } from '@angular/core';
import { NodeDir } from 'src/app/core/models/NodeDir';
import { faCoffee, faFileLines, faFileAlt, faFileCode, faCode, faCodeCompare, faLaptopCode, faMicrochip, faFile } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-child-file',
  templateUrl: './child-file.component.html',
  styleUrls: ['./child-file.component.scss']
})
export class ChildFileComponent {
  @Input() data: NodeDir;
  faFileIcon = faFile;
}
