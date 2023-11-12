import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";

export class BreakNode extends Node {


	constructor(positionToken: PositionToken, toke: string) {
        super(positionToken, null, toke);
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        return ;
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
        if (!environment.etsBack.isEmpty()) {
            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: environment.etsBack.peek()});
        }
        
    }
}
