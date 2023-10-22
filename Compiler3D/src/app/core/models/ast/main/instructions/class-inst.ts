import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";

export class ClassInst extends Node {
    private _name: string;
    private _nameExtends: string;
    private _isPublic: boolean;
    private _isFinal: boolean;
    private _instructions: Array<Node>;


	constructor(positionToken: PositionToken, token: string, name: string, nameExtends: string, isPublic: boolean, isFinal: boolean, instructions: Array<Node>) {
		super(positionToken, null, token);
        this._name = name;
		this._nameExtends = nameExtends;
		this._isPublic = isPublic;
		this._isFinal = isFinal;
		this._instructions = instructions;
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
