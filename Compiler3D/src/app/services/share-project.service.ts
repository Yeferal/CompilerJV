import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NodeDir } from '../core/models/NodeDir';

@Injectable({
  providedIn: 'root'
})
export class ShareProjectService {
  private root: NodeDir | null = null;
  private dataRootSubject = new Subject<NodeDir>();
  dataRoot$ = this.dataRootSubject.asObservable();

  constructor() { }

  sendDataRoot(root: NodeDir) {
    this.dataRootSubject.next(root);
  }

  getRoot(){
    return this.root;
  }

  setRoot(newRoot: NodeDir){
    this.root = newRoot;
  }
}
