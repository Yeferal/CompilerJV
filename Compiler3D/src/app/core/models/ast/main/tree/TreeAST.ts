import { ErrorGramm } from "../../error/error-gramm";
import { Node } from "../node";

export class TreeAST {
    
	constructor(public listRoot: Node [], public listError: ErrorGramm []) {
	}

}