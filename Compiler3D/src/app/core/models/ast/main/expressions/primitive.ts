import { Quartet } from "../../../tree-direction/quartet";
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
        if (this.type.name == "STRING") {
            //En teorioa tendria que crear una variable de tipo char[] para almacenar y luego agregarlo y retornar la etiqueta
            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsString.push(tTemp);
            const quartetAsigString: Quartet = { operator: "=s", arg1: "\""+ this.value +"\"", arg2: null, result: "t"+tTemp };
            environment.handlerQuartet.insertQuartet(quartetAsigString);

            return "t"+tTemp;    
        }else {
            if (this.type.name == "BOOLEAN") {
                return this.value? 1 : 0;
            } else if (this.type.name == "NULL") {
                return -1;
            }
            return this.value;
        }
        
    }

}
