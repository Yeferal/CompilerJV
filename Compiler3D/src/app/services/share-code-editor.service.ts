import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SymbolTable } from '../core/models/ast/main/table/symbol-table';
import { ErrorGramm } from '../core/models/ast/error/error-gramm';
import { TypeTable } from '../core/models/ast/main/table/TypeTable';

export interface CursorCode {
  row: number;
  column: number;
}


@Injectable({
  providedIn: 'root'
})
export class ShareCodeEditorService {
  private symbolTable: SymbolTable = new SymbolTable();
  private typeTable: TypeTable = new TypeTable();
  private listError: Array<ErrorGramm> = [];
  private dataSubject = new Subject<CursorCode>();
  data$ = this.dataSubject.asObservable();

  private dataTableSubject = new Subject<SymbolTable>();
  dataTable$ = this.dataTableSubject.asObservable();

  constructor() { }

  sendData(data: CursorCode) {
    this.dataSubject.next(data);
  }

  sendDataTable(data: SymbolTable) {
    this.dataTableSubject.next(data);
  }

  getSymbolTable(){
    return this.symbolTable;
  }

  setSymbolTable(symbolTable: SymbolTable){
    this.symbolTable = symbolTable;
  }

  getTypeTable(){
    return this.typeTable;
  }

  setTypeTable(typeTable: TypeTable){
    this.typeTable = typeTable;
  }

  getListError(){
    return this.listError;
  }

  setListError(listError: Array<ErrorGramm>){
    this.listError = listError;
  }
}
