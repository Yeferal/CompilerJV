import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { EncapsulationType } from "../utils/encapsulation-type";

export class ClassInst extends Node {
    private _isGetter: boolean;
    private _isSetter: boolean;

    private _name: string;
    private _nameExtends: string;
    private _isPublic: boolean;
    private _isFinal: boolean;
    private _instructions: Array<Node>;

	constructor(positionToken: PositionToken, token: string, isGetter: boolean, isSetter: boolean, name: string, nameExtends: string, isPublic: boolean, isFinal: boolean, instructions: Array<Node>) {
		super(positionToken, null, token);
        this._isGetter = isGetter;
		this._isSetter = isSetter;
		this._name = name;
		this._nameExtends = nameExtends;
		this._isPublic = isPublic;
		this._isFinal = isFinal;
		this._instructions = instructions;
	}

    /**
     * Getter isGetter
     * @return {boolean}
     */
	public get isGetter(): boolean {
		return this._isGetter;
	}

    /**
     * Getter isSetter
     * @return {boolean}
     */
	public get isSetter(): boolean {
		return this._isSetter;
	}

    /**
     * Getter name
     * @return {string}
     */
	public get name(): string {
		return this._name;
	}

    /**
     * Getter nameExtends
     * @return {string}
     */
	public get nameExtends(): string {
		return this._nameExtends;
	}

    /**
     * Getter isPublic
     * @return {boolean}
     */
	public get isPublic(): boolean {
		return this._isPublic;
	}

    /**
     * Getter isFinal
     * @return {boolean}
     */
	public get isFinal(): boolean {
		return this._isFinal;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Setter isGetter
     * @param {boolean} value
     */
	public set isGetter(value: boolean) {
		this._isGetter = value;
	}

    /**
     * Setter isSetter
     * @param {boolean} value
     */
	public set isSetter(value: boolean) {
		this._isSetter = value;
	}

    /**
     * Setter name
     * @param {string} value
     */
	public set name(value: string) {
		this._name = value;
	}

    /**
     * Setter nameExtends
     * @param {string} value
     */
	public set nameExtends(value: string) {
		this._nameExtends = value;
	}

    /**
     * Setter isPublic
     * @param {boolean} value
     */
	public set isPublic(value: boolean) {
		this._isPublic = value;
	}

    /**
     * Setter isFinal
     * @param {boolean} value
     */
	public set isFinal(value: boolean) {
		this._isFinal = value;
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
