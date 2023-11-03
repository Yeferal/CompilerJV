import { PositionToken } from "../error/position-token";
import { Environment } from "./environment/environment";
import { HandlerComprobation } from "./environment/handler-comprobation";
import { Node } from "./node";

export class PackageNode extends Node {

    private _path: string;


	constructor(positionToken: PositionToken, token: string, path: string) {
        super(positionToken, null, token);
        this._path = path;
	}

    /**
     * Getter path
     * @return {string}
     */
	public get path(): string {
		return this._path;
	}

    /**
     * Setter path
     * @param {string} value
     */
	public set path(value: string) {
		this._path = value;
	}
    

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }
    public override executeComprobationControlFlow(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }
    public override executeComprobationAccess(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }
    public override executeComprobation(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }
    public override execute(environment: Environment): any {
        throw new Error("Method not implemented.");
    }

}