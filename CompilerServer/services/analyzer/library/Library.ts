import { Project } from "./Project";

export class Library {
    listProject: Array<Project> = [];


	constructor(listProject: Array<Project> ) {
		this.listProject = listProject;
	}


}