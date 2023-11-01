import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";

export class InstanceObject extends Node {
    private _id: string;
    private _params: Array<Node>;
    

	constructor(positionToken: PositionToken, token: string, id: string, params: Array<Node>) {
		super(positionToken, null, token);
        this._id = id;
		this._params = params;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter params
     * @return {Array<Node>}
     */
	public get params(): Array<Node> {
		return this._params;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter params
     * @param {Array<Node>} value
     */
	public set params(value: Array<Node>) {
		this._params = value;
	}

    generateListParamsType(): Array<string>{
        let list: Array<string> = [];

        return list;
    }


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
        const resType = handlerComprobation.typeTable.getDataType(this.id);
        if (resType == null) {
            //Error no existe un tipo de dato
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato << ${this.type.name}>> no existe.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }else {
            this.type = resType;
        }

        const symbolSearch = handlerComprobation.searchSymbol(this.id+"_"+this.id);
        if (symbolSearch != null) {
            console.log("Si lo encontro");

        } else {
            console.log("No lo encontro");
            //El constructor aun no existe tenesmos que buscarlo, pero solo para sus parametros
            
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
