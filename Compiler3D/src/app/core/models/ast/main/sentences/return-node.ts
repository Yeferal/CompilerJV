import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";

export class ReturnNode extends Node {
    private _value: Node;

    constructor(positionToken: PositionToken, toke: string, value: Node) {
        super(positionToken, null, toke);
        this._value = value;
	}

    /**
     * Getter value
     * @return {Node}
     */
	public get value(): Node {
		return this._value;
	}

    /**
     * Setter value
     * @param {Node} value
     */
	public set value(value: Node) {
		this._value = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resReturn = this.value.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        this.type = resReturn;
        return resReturn;
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
        
        const tRetorn = this.value.execute(environment);
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion del return", arg2: null, result: null});

        //Encontrar el simbolo del return
        let symbol = environment.symbolTable.searchSymbolReturn(environment.ambitNow.peek());

        const tTemp = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

        environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tRetorn, arg2: symbol.direction, result: "t"+tTemp});

        //goto a la etiquera da salida
        if (!environment.etsReturn.isEmpty()) {
            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: environment.etsReturn.peek()});
        }
    }
}
