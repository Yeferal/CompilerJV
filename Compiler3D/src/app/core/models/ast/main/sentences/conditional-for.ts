import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";

export class ConditionalFor extends Node {
    private _asignation: Node;
    private _condition: Node;
    private _sentence: Node;
    private _instructions: Array<Node>;
    
	constructor(positionToken: PositionToken, toke: string, asignation: Node, condition: Node, sentence: Node, instructions: Array<Node>) {
		super(positionToken, null, toke);
        this._asignation = asignation;
		this._condition = condition;
		this._sentence = sentence;
		this._instructions = instructions;
	}

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Getter condition
     * @return {Node}
     */
	public get condition(): Node {
		return this._condition;
	}

    /**
     * Getter sentence
     * @return {Node}
     */
	public get sentence(): Node {
		return this._sentence;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
	}

    /**
     * Setter condition
     * @param {Node} value
     */
	public set condition(value: Node) {
		this._condition = value;
	}

    /**
     * Setter sentence
     * @param {Node} value
     */
	public set sentence(value: Node) {
		this._sentence = value;
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
