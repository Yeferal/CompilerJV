import { Injectable } from '@angular/core';
import { NodeDir } from '../core/models/NodeDir';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDirService {

  private dataNodeSubject = new Subject<NodeDir>();
  dataNode$ = this.dataNodeSubject.asObservable();

  private dataNodeFileSubject = new Subject<NodeDir>();
  dataNodeFile$ = this.dataNodeFileSubject.asObservable();

  constructor() { }

  sendNodeData(node: NodeDir) {
    this.dataNodeSubject.next(node);
  }

  sendNodeFileData(node: NodeDir) {
    this.dataNodeFileSubject.next(node);
  }
}
