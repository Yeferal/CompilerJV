import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { BreakNode } from "./break-node";
import { ConditionalElse } from "./conditional-else";
import { ConditionalElseIf } from "./conditional-else-if";
import { ContinueNode } from "./continue-node";
import { ReturnNode } from "./return-node";

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

	public get condition(): Node {
		return this._condition;
	}

	public get instructions(): Array<Node> {
		return this._instructions;
	}

	public get elseIfList(): Array<ConditionalElseIf> {
		return this._elseIfList;
	}

	public get elseNode(): ConditionalElse {
		return this._elseNode;
	}

	public set condition(value: Node) {
		this._condition = value;
	}

	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}

	public set elseIfList(value: Array<ConditionalElseIf>) {
		this._elseIfList = value;
	}

	public set elseNode(value: ConditionalElse) {
		this._elseNode = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resCondition = this.condition.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resCondition == null || resCondition.name != "BOOLEAN") {
            //Error el valor de la condicional no es un booleano
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de valor << ${this.token}>> no es de tipo booleano.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

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

        //Evaluar la comprobacion de los else-if
        if (this.elseIfList!=null && this.elseIfList.length>0) {
            for (let i = 0; i < this.elseIfList.length; i++) {
                this.elseIfList[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                
            }
        }
        
        //Evaluar la comprobacion de los else
        if (this.elseNode!=null) {
            this.elseNode.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        }
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
