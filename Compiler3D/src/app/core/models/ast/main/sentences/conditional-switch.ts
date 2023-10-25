import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";

export class ConditionalSwitch extends Node {
    private _value: Node;
    private _listCases: Array<Node>;
    private _defaultCase: Node;

	constructor(positionToken: PositionToken, toke: string, value: Node, listCases: Array<Node>, defaultCase: Node) {
		super(positionToken, null, toke);
        this._value = value;
		this._listCases = listCases;
		this._defaultCase = defaultCase;
	}

    /**
     * Getter value
     * @return {Node}
     */
	public get value(): Node {
		return this._value;
	}

    /**
     * Getter listCases
     * @return {Array<Node>}
     */
	public get listCases(): Array<Node> {
		return this._listCases;
	}

    /**
     * Getter defaultCase
     * @return {Node}
     */
	public get defaultCase(): Node {
		return this._defaultCase;
	}

    /**
     * Setter value
     * @param {Node} value
     */
	public set value(value: Node) {
		this._value = value;
	}

    /**
     * Setter listCases
     * @param {Array<Node>} value
     */
	public set listCases(value: Array<Node>) {
		this._listCases = value;
	}

    /**
     * Setter defaultCase
     * @param {Node} value
     */
	public set defaultCase(value: Node) {
		this._defaultCase = value;
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
