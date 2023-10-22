import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { enterText } from 'src/app/Global/inputText';
import { CursorCode, ShareCodeEditorService } from 'src/app/services/share-code-editor.service';

@Component({
  selector: 'app-section-editor-code-optimized',
  templateUrl: './section-editor-code-optimized.component.html',
  styleUrls: ['./section-editor-code-optimized.component.scss']
})
export class SectionEditorCodeOptimizedComponent {
  @ViewChild('editorLeft') codeMirrorLeft: CodemirrorComponent;
  @ViewChild('editorRight') codeMirrorRight: CodemirrorComponent;

  editoNum: number = 1;
  codeLeft: string = enterText;
  codeRight: string = enterText;

  editorConfig = {
    lineNumbers: true,
    theme: 'darcula', //Este tiene letra mas grande
    mode: 'text/x-c++src',
    // Agrega más opciones de configuración según tus necesidades
  };

  constructor(private shareCodeEditorService: ShareCodeEditorService) {

  }

  

  compile(){
    
  }

  getCursorCodePosition(): CursorCode {
    const cursor = this.codeMirrorLeft.codeMirror.getCursor();
    const cursorCode: CursorCode = {
      row: cursor.line + 1,
      column: cursor.ch + 1
    };
    return cursorCode;
  }

  getCursorCodePositionEditor(codeMirror: CodemirrorComponent): CursorCode {
    const cursor = codeMirror.codeMirror.getCursor();
    const cursorCode: CursorCode = {
      row: cursor.line + 1,
      column: cursor.ch + 1
    };
    return cursorCode;
  }

  onCursorActivityLeft() {
    this.sendPositionCursor(this.getCursorCodePositionEditor(this.codeMirrorLeft));
  }

  onCursorActivityRight() {
    this.sendPositionCursor(this.getCursorCodePositionEditor(this.codeMirrorRight));
  }

  sendPositionCursor(cursorPosition: CursorCode){
    this.shareCodeEditorService.sendData(cursorPosition);
  }
}
