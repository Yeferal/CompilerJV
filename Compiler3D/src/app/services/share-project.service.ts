import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NodeDir } from '../core/models/NodeDir';

@Injectable({
  providedIn: 'root'
})
export class ShareProjectService {
  private root: NodeDir | null = null;
  private listTabs: Array<NodeDir> = [];
  private actualNode: NodeDir | null = null;

  private dataRootSubject = new Subject<NodeDir>();
  dataRoot$ = this.dataRootSubject.asObservable();

  private dataActualSubject = new Subject<NodeDir>();
  dataActual$ = this.dataActualSubject.asObservable();

  private saveSubject = new Subject<boolean>();
  dataSave$ = this.saveSubject.asObservable();

  private saveAsSubject = new Subject<boolean>();
  dataSaveAs$ = this.saveAsSubject.asObservable();

  constructor() { }

  sendDataRoot(root: NodeDir) {
    this.dataRootSubject.next(root);
  }

  sendDataActual(root: NodeDir) {
    this.dataActualSubject.next(root);
  }

  sendDataSave() {
    this.saveSubject.next(true);
  }

  sendDataSaveAs() {
    this.saveAsSubject.next(true);
  }

  getRoot(){
    return this.root;
  }

  setRoot(newRoot: NodeDir){
    this.root = newRoot;
  }

  getTabs(){
    return this.listTabs;
  }

  setTabs(list: Array<NodeDir>){
    this.listTabs = list;
  }

  getActualNode(){
    return this.actualNode;
  }

  setActualNode(newActual: NodeDir){
    this.actualNode = newActual;
  }
}
