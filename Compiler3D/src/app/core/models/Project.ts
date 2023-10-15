import { FileProject } from "./FileProject"
import { Folder } from "./Folder";

export class Project {
    
    name: string;
    listContent: Array<FileProject | Folder> = [];

	constructor(name: string, listContent: Array<FileProject | Folder> ) {
		this.name = name;
		this.listContent = listContent;
	}



}