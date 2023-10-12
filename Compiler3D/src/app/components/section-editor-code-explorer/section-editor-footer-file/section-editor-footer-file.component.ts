import { Component, Input } from '@angular/core';
import { ShareCodeEditorService } from 'src/app/services/share-code-editor.service';

@Component({
  selector: 'app-section-editor-footer-file',
  templateUrl: './section-editor-footer-file.component.html',
  styleUrls: ['./section-editor-footer-file.component.scss']
})
export class SectionEditorFooterFileComponent {
  @Input() row: number = 0;
  @Input() column: number = 0;

  constructor(private shareCodeEditorService: ShareCodeEditorService){
    this.shareCodeEditorService.data$.subscribe(
      data => {
        this.row = data.row;
        this.column = data.column;
      }
    );
  }
}
