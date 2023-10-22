import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { DynamicDataType } from "../utils/DynamicDataType";

export class Primitive extends Node{
    
    private _value: any;

    /**
     * @constructor
     * @param value valor del dato primitivo puede ser(integer, double, char, string, boolean)
     */
    
	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, value: any) {
        super(positionToken, type, toke);
		this._value = value;
	}

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
        return this.type;
    }

    public override executeComprobationControlFlow(handlerComprobation: HandlerComprobation): any {
        return this.type;
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
