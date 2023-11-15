import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { LogicalOperation } from "../expressions/logical-operation";
import { Node } from "../node";
import { BreakNode } from "./break-node";
import { ContinueNode } from "./continue-node";
import { ReturnNode } from "./return-node";

export class ConditionalDoWhile extends Node {
    private _condition: Node;
    private _instructions: Array<Node>;

    constructor(positionToken: PositionToken, toke: string, condition: Node, instructions: Array<Node>) {
		super(positionToken, null, toke);
        this._condition = condition;
		this._instructions = instructions;
	}

    public get condition(): Node {
		return this._condition;
	}

	public get instructions(): Array<Node> {
		return this._instructions;
	}

	public set condition(value: Node) {
		this._condition = value;
	}

	public set instructions(value: Array<Node>) {
		this._instructions = value;
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
        const etTempBack= environment.addEt();
        environment.etsBack.push("et"+etTempBack);
        

        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Generadno el do while", arg2: null, result: null});
        const etTempInit= environment.addEt();
        environment.etsInit.push("et"+etTempInit);
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempInit});
        
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del do while", arg2: null, result: null});
        for (let i = 0; i < this.instructions.length; i++) {
            this.instructions[i].execute(environment);
            
        }

        const tCondition = this.condition.execute(environment);

        if (this.condition instanceof LogicalOperation) {
            if (!environment.etTrue.isEmpty()) {
                while (!environment.etTrue.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etTrue.pop()});
                }
            }

            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempInit});


            if (!environment.etFalse.isEmpty()) {
                while (!environment.etFalse.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etFalse.pop()});
                }
            }

        } else {
            const etTempTrue = environment.addEt();
            const etTempFalse = environment.addEt();

            environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: tCondition, arg2: null, result: "et"+etTempTrue});
            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempFalse});

            environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempTrue});

            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempInit});
            
            environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempFalse});

        }

        if (!environment.etsInit.isEmpty()) {
            // environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: environment.etsInit.pop()});
            environment.etsInit.pop()
        }
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etsBack.pop()});

    }
}
