import { FileProject } from "../models/FileProject";
import { Folder } from "../models/Folder";
import { NodeDir } from "../models/NodeDir";
import { Project } from "../models/Project";

export function transformProject(project: Project): NodeDir{
    let root: NodeDir = {
      nodeFather: null,
      typeNode: 'root',
      nodeChilds: [],
      name: project.name,
      path: project.name,
      pathArray: [project.name],
      active: false,
      selected: false
    }
    root.nodeChilds = transformContentProject(project.listContent, root);
    root = sortProject(root);
    return root;
}

export function  transformContentProject(listContent: Array<Folder | FileProject>, nodeFather: NodeDir): Array<NodeDir>{
    let list = new Array<NodeDir>;
    for (let i = 0; i < listContent.length; i++) {
      if (listContent[i].type == "folder") {
        const element: Folder = listContent[i] as Folder;
        let nodeChild: NodeDir = {
          nodeFather: nodeFather,
          typeNode: 'directory',
          nodeChilds: [],
          name: element.name,
          path: nodeFather.path+"/"+element.name,
          pathArray: [...nodeFather.pathArray, element.name],
          active: false,
          selected: false
        }
        nodeChild.nodeChilds = transformContentProject(element.listContent, nodeChild);
        list.push(nodeChild);
      } else {
        const element: FileProject = listContent[i] as FileProject;
        let nodeChild: NodeDir = {
          nodeFather: nodeFather,
          typeNode: 'file',
          nodeChilds: [],
          name: element.name,
          path: nodeFather.path+"/"+element.name,
          pathArray: [...nodeFather.pathArray, element.name],
          active: false,
          selected: false
        }
        list.push(nodeChild);
      }
      
    }
    return list;
}

export function sortProject(root: NodeDir): NodeDir{
    root.nodeChilds = sortContent(root.nodeChilds);
    return root;
}

export function sortContent(listContent: Array<NodeDir>): Array<NodeDir>{
    const newListConten = listContent.sort((a: NodeDir, b: NodeDir) => {
        if (a.typeNode === 'directory') {
            a.nodeChilds = sortContent(a.nodeChilds);
        }
        if (b.typeNode === 'directory') {
            b.nodeChilds = sortContent(b.nodeChilds);
        }
        if (a.typeNode === b.typeNode) {
            
            return a.name.localeCompare(b.name);
        } else {
            return a.typeNode === 'directory' ? -1 : 1;
        }
    });
    
    return newListConten;
}