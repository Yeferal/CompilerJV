import { FileProject } from "./FileProject";

export class Folder {

    name: string;
    listContent: Array<FileProject | Folder> = [];
	type: string = "folder";

	constructor(name: string, listContent: Array<FileProject | Folder> ) {
		this.name = name;
		this.listContent = listContent;
	}

}