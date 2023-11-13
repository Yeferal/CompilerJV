import { Component, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { enterText } from 'src/app/Global/inputText';
import { SectionService } from 'src/app/services/section.service';
import { CursorCode, ShareCodeEditorService } from 'src/app/services/share-code-editor.service';

@Component({
  selector: 'app-section-editor-code3d',
  templateUrl: './section-editor-code3d.component.html',
  styleUrls: ['./section-editor-code3d.component.scss']
})
export class SectionEditorCode3dComponent implements OnInit {
  @ViewChild('editor') codeMirror: CodemirrorComponent;

  code: string = "";

  editorConfig = {
    lineNumbers: true,
    theme: 'darcula', //Este tiene letra mas grande
    mode: 'text/x-c++src',
    // Agrega más opciones de configuración según tus necesidades
  };

  constructor(private shareCodeEditorService: ShareCodeEditorService,
    private sectionService: SectionService) {
      this.sectionService.data3dTxt$.subscribe(
        txt => {
          this.code = this.sectionService.getText3D();
        }
      );
  }
  ngOnInit(): void {
    this.code = this.sectionService.getText3D();
  }

  
  

  compile(){
    
  }

  getCursorCodePosition(): CursorCode {
    const cursor = this.codeMirror.codeMirror.getCursor();
    const cursorCode: CursorCode = {
      row: cursor.line + 1,
      column: cursor.ch + 1
    };
    return cursorCode;
  }

  onCursorActivity() {
    this.sendPositionCursor();
  }

  sendPositionCursor(){
    this.shareCodeEditorService.sendData(this.getCursorCodePosition());
  }
}
