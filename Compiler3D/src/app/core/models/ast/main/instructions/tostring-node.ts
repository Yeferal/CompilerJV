import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";

export class TostringNode extends Node {
    private _idObj: string;
    private _isThis: boolean;
    public nodeId: Identifier;

	constructor(positionToken: PositionToken, toke: string, idObj: string, isThis: boolean) {
        super(positionToken, null, toke);
        this._idObj = idObj;
		this._isThis = isThis;
	}

    /**
     * Getter idObj
     * @return {string}
     */
	public get idObj(): string {
		return this._idObj;
	}

    /**
     * Getter isThis
     * @return {boolean}
     */
	public get isThis(): boolean {
		return this._isThis;
	}

    /**
     * Setter idObj
     * @param {string} value
     */
	public set idObj(value: string) {
		this._idObj = value;
	}

    /**
     * Setter isThis
     * @param {boolean} value
     */
	public set isThis(value: boolean) {
		this._isThis = value;
	}

    public isObject(dynamicDatType: DynamicDataType): boolean {
        const name = dynamicDatType.name;
        if (name!="FLOAT" && name!="INTEGER" && name!="CHAR" && name!="STRING" && name!="BOOLEAN") {
            return true;
        }
        return false;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        this.nodeId = new Identifier(this.positionToken, this.idObj, this.idObj, this.isThis);
        const resType = this.nodeId.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        this.type = resType;
        
        if (!this.isObject(resType)) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `La posicion no es un Entero, entonce el ${this.idObj} no es un objeto.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        }
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
        const tTemp = this.nodeId.execute(environment);
        
        environment.handlerQuartet.insertQuartet({operator:"printfi", arg1: "\\n", arg2: tTemp, result: null});
    }
}
