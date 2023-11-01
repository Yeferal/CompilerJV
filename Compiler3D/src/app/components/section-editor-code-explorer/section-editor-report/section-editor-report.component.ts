import { Component, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { enterText } from 'src/app/Global/inputText';
import { ErrorGramm } from 'src/app/core/models/ast/error/error-gramm';
import { TypeTable } from 'src/app/core/models/ast/main/table/TypeTable';
import { Symbol } from 'src/app/core/models/ast/main/table/symbol';
import { SymbolTable } from 'src/app/core/models/ast/main/table/symbol-table';
import { DynamicDataType } from 'src/app/core/models/ast/main/utils/DynamicDataType';
import { CursorCode, ShareCodeEditorService } from 'src/app/services/share-code-editor.service';

@Component({
  selector: 'app-section-editor-report',
  templateUrl: './section-editor-report.component.html',
  styleUrls: ['./section-editor-report.component.scss']
})
export class SectionEditorReportComponent implements OnInit {
  @ViewChild('editor') codeMirror: CodemirrorComponent;

  code: string = enterText;
  table: SymbolTable = new SymbolTable();
  arraySymbol: Array<Symbol> = [];
  listError: Array<ErrorGramm> = [];
  typeTable: TypeTable = new TypeTable();
  listTypes: Array<DynamicDataType> = []; 

  editorConfig = {
    lineNumbers: true,
    theme: 'darcula', //Este tiene letra mas grande
    mode: 'text/x-java',
    // Agrega más opciones de configuración según tus necesidades
  };

  constructor(private shareCodeEditorService: ShareCodeEditorService) {
    // shareCodeEditorService.dataTable$.subscribe({
    //   next: data => {
    //     this.table = data;
    //     this.arraySymbol = this.table.stackTable.peek();
    //     console.log(this.arraySymbol);
        
    //   }
    // });
  }

  ngOnInit(): void {
    this.table = this.shareCodeEditorService.getSymbolTable();
    this.typeTable = this.shareCodeEditorService.getTypeTable();
    this.arraySymbol = this.table.stackTable.peek();
    this.listTypes = this.typeTable.table;
    this.listError = this.shareCodeEditorService.getListError();
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
