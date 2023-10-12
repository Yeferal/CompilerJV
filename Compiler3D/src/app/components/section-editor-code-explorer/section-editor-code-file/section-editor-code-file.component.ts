import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { enterText } from 'src/app/Global/inputText';
import { PositionToken } from 'src/app/core/models/mlg/error/position-token';
import { CursorCode, ShareCodeEditorService } from 'src/app/services/share-code-editor.service';
import {parser as Parser} from 'src/assets/gramm/mlg/gramm-mlg.js'

@Component({
  selector: 'app-section-editor-code-file',
  templateUrl: './section-editor-code-file.component.html',
  styleUrls: ['./section-editor-code-file.component.scss']
})
export class SectionEditorCodeFileComponent {
  @ViewChild('editor') codeMirror: CodemirrorComponent;
  

  code: string = enterText;
  parser: any;

  editorConfig = {
    lineNumbers: true,
    // theme: 'material',
    theme: 'darcula', //Este tiene letra mas grande
    // theme: 'ayu-dark',
    // theme: 'material-darker',
    // theme: 'monokai',

    // mode: 'javascript',
    // mode: 'text/x-python',
    mode: 'text/x-java',
    // mode: 'text/x-c++src',
    // mode: 'milenguaje',
    
    // Agrega más opciones de configuración según tus necesidades
  };

  constructor(private shareCodeEditorService: ShareCodeEditorService) {
    // Crea una instancia del parser generado
    this.parser = Parser;
  }

  ngOnInit() {
    
  }

  compile(){
    try {
      // Evalúa la expresión utilizando el parser
      const txtEnter = this.codeMirror.codeMirror.getValue();
      const result: PositionToken = this.parser.parse(txtEnter);
      console.log(result.toString());
      
      return 1;
    } catch (error) {
      console.error('Error al evaluar la expresión:', error);
      return NaN;
    }
  }

  getCursorPosition(): { line: number; column: number } {
    const cursor = this.codeMirror.codeMirror.getCursor();
    return { line: cursor.line + 1, column: cursor.ch + 1 };
  }

  getCursorCodePosition(): CursorCode {
    const cursor = this.codeMirror.codeMirror.getCursor();
    const cursorCode: CursorCode = {
      row: cursor.line + 1,
      column: cursor.ch + 1
    };
    return cursorCode;
  }

  onEditorChange() {
    // console.log(this.getCursorPosition());
  }

  onCursorActivity() {
    // console.log(this.getCursorPosition());
    this.sendPositionCursor();
  }

  sendPositionCursor(){
    this.shareCodeEditorService.sendData(this.getCursorCodePosition());
  }
}
