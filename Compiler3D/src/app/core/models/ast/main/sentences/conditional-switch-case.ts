import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Primitive } from "../expressions/primitive";
import { Node } from "../node";

export class ConditionalSwitchCase extends Node {
    private _valueCase: Primitive;
    private _instructions: Array<Node>;

	constructor(positionToken: PositionToken, toke: string, valueCase: Primitive, instructions: Array<Node>) {
		super(positionToken, null, toke);
        this._valueCase = valueCase;
		this._instructions = instructions;
	}

    /**
     * Getter valueCase
     * @return {Primitive}
     */
	public get valueCase(): Primitive {
		return this._valueCase;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Setter valueCase
     * @param {Primitive} value
     */
	public set valueCase(value: Primitive) {
		this._valueCase = value;
	}

    /**
     * Setter instructions
     * @param {Array<Node>} value
     */
	public set instructions(value: Array<Node>) {
		this._instructions = value;
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
