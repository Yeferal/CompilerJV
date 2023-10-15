export class FileProject{
    path: string;
    name: string;
    text: string;
	type: string = "file";

	constructor(path: string, name: string) {
		this.path = path;
		this.name = name;
	}

}