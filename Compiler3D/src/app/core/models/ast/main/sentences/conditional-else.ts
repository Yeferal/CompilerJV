import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { BreakNode } from "./break-node";
import { ContinueNode } from "./continue-node";
import { ReturnNode } from "./return-node";

export class ConditionalElse extends Node {

    private _instructions: Array<Node>;


	constructor(positionToken: PositionToken, toke: string, instructions: Array<Node>) {
        super(positionToken, null, toke);
		this._instructions = instructions;
	}


    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Setter instructions
     * @param {Array<Node>} value
     */
	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
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

        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del else", arg2: null, result: null});
        for (let i = 0; i < this.instructions.length; i++) {
            // console.log(this.instructions[i]);
            
            this.instructions[i].execute(environment);
            
        }
    }
}
