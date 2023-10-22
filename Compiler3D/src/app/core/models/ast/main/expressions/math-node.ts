import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { MathType } from "../utils/math-type";

export class MathNode extends Node{
    private _mathType: MathType;
    private _nodeLeft: Node;
    private _nodeRigth: Node;


	constructor(positionToken: PositionToken, token: string, mathType: MathType, nodeLeft: Node, nodeRigth: Node) {
		super(positionToken, null, token);
        this._mathType = mathType;
		this._nodeLeft = nodeLeft;
		this._nodeRigth = nodeRigth;
	}

    /**
     * Getter mathType
     * @return {MathType}
     */
	public get mathType(): MathType {
		return this._mathType;
	}

    /**
     * Getter nodeLeft
     * @return {Node}
     */
	public get nodeLeft(): Node {
		return this._nodeLeft;
	}

    /**
     * Getter nodeRigth
     * @return {Node}
     */
	public get nodeRigth(): Node {
		return this._nodeRigth;
	}

    /**
     * Setter mathType
     * @param {MathType} value
     */
	public set mathType(value: MathType) {
		this._mathType = value;
	}

    /**
     * Setter nodeLeft
     * @param {Node} value
     */
	public set nodeLeft(value: Node) {
		this._nodeLeft = value;
	}

    /**
     * Setter nodeRigth
     * @param {Node} value
     */
	public set nodeRigth(value: Node) {
		this._nodeRigth = value;
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