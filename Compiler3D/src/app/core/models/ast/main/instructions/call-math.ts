import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { MathType } from "../utils/math-type";

export class CallMath extends Node {
    private _mathType: MathType;
    private _paramRight: Node;
    private _paramLeft: Node;


	constructor(positionToken: PositionToken, token: string, mathType: MathType, paramRight: Node, paramLeft: Node) {
		super(positionToken, null, token);
        this._mathType = mathType;
		this._paramRight = paramRight;
		this._paramLeft = paramLeft;
	}

    /**
     * Getter mathType
     * @return {MathType}
     */
	public get mathType(): MathType {
		return this._mathType;
	}

    /**
     * Getter paramRight
     * @return {Node}
     */
	public get paramRight(): Node {
		return this._paramRight;
	}

    /**
     * Getter paramLeft
     * @return {Node}
     */
	public get paramLeft(): Node {
		return this._paramLeft;
	}

    /**
     * Setter mathType
     * @param {MathType} value
     */
	public set mathType(value: MathType) {
		this._mathType = value;
	}

    /**
     * Setter paramRight
     * @param {Node} value
     */
	public set paramRight(value: Node) {
		this._paramRight = value;
	}

    /**
     * Setter paramLeft
     * @param {Node} value
     */
	public set paramLeft(value: Node) {
		this._paramLeft = value;
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
