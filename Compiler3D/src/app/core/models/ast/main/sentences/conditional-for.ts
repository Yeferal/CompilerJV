import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { BreakNode } from "./break-node";
import { ContinueNode } from "./continue-node";
import { ReturnNode } from "./return-node";

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
        this.condition.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        
        const resCondition = this.condition.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resCondition == null || resCondition.name != "BOOLEAN") {
            //Error el valor de la condicional no es un booleano
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de valor << ${this.token}>> no es de tipo booleano.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        this.sentence.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);

        //AGREGAR UN AMBITO
        handlerComprobation.addAmbit();

        if (this.instructions.length > 0) {
            for (let i = 0; i < this.instructions.length; i++) {
                this.instructions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                //Evaluar si es un return para determinar el tipo de dato
                if (this.instructions[i] instanceof ReturnNode) {
                    const returnNode = this.instructions[i] as ReturnNode;
                    return returnNode.type;
                } else if (this.instructions[i] instanceof BreakNode) {
                    const breakNode = this.instructions[i] as BreakNode;
                    return breakNode.type;
                } else if (this.instructions[i] instanceof ContinueNode) {
                    const continueNode = this.instructions[i] as ContinueNode;
                    return continueNode.type;
                }
                // const element = array[i];
            }
        }

        //SALIR DEL AMBITO
        handlerComprobation.popAmbit();

        return this.type;
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
