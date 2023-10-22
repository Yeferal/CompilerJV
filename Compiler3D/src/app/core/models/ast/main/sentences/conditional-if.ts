import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { ConditionalElse } from "./conditional-else";
import { ConditionalElseIf } from "./conditional-else-if";

export class ConditionalIf extends Node {

    private _condition: Node;
    private _instructions: Array<Node>;
    private _elseIfList: Array<ConditionalElseIf>;
    private _elseNode: ConditionalElse;

	constructor(positionToken: PositionToken, toke: string, condition: Node, instructions: Array<Node>, elseIfList: Array<ConditionalElseIf>, elseNode: ConditionalElse) {
		super(positionToken, null, toke);
        this._condition = condition;
		this._instructions = instructions;
		this._elseIfList = elseIfList;
		this._elseNode = elseNode;
	}

    /**
     * Getter condition
     * @return {Node}
     */
	public get condition(): Node {
		return this._condition;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Getter elseIfList
     * @return {Array<ConditionalElseIf>}
     */
	public get elseIfList(): Array<ConditionalElseIf> {
		return this._elseIfList;
	}

    /**
     * Getter elseNode
     * @return {ConditionalElse}
     */
	public get elseNode(): ConditionalElse {
		return this._elseNode;
	}

    /**
     * Setter condition
     * @param {Node} value
     */
	public set condition(value: Node) {
		this._condition = value;
	}

    /**
     * Setter instructions
     * @param {Array<Node>} value
     */
	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}

    /**
     * Setter elseIfList
     * @param {Array<ConditionalElseIf>} value
     */
	public set elseIfList(value: Array<ConditionalElseIf>) {
		this._elseIfList = value;
	}

    /**
     * Setter elseNode
     * @param {ConditionalElse} value
     */
	public set elseNode(value: ConditionalElse) {
		this._elseNode = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resCondition = this.condition.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resCondition != handlerComprobation.typeTable.getDataType("BOOLEAN")) {
            //Error el valor de la condicional no es un booleano
        }

        //AGREGAR UN AMBITO

        if (this.instructions.length > 0) {
            for (let i = 0; i < this.instructions.length; i++) {
                this.instructions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                //Evaluar si es un return para determinar el tipo de dato
                // if (this.instructions[i] instanceof ) {
                // }
                // const element = array[i];
            }
        }

        //SALIR DEL AMBITO

        //Evaluar la comprobacion de los else-if

        //Evaluar la comprobacion de los else

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
