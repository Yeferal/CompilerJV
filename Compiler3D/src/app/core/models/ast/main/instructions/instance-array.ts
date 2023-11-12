import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";

export class InstanceArray extends Node {
    private _id: string;
    private _dims: Array<Node>;

	constructor(positionToken: PositionToken, type: DynamicDataType, token: string, dims: Array<Node>) {
		super(positionToken, type, token);
        this._dims = dims;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter dims
     * @return {Array<Node>}
     */
	public get dims(): Array<Node> {
		return this._dims;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter dims
     * @param {Array<Node>} value
     */
	public set dims(value: Array<Node>) {
		this._dims = value;
	}

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        if (this.type == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Tipo de dato no valido para la instancia del arreglo << ${this.token}>>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (!handlerComprobation.typeTable.isExistType(this.type.name)) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe el tipo de dato para la instancia del arreglo << ${this.token}>>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
        
        for (let i = 0; i < this.dims.length; i++) {
            const resType: DynamicDataType = this.dims[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (resType.name !== "INTEGER") {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los valores de las dimenesione no son Enteros << ${this.token}>>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
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
        // throw new Error("Method not implemented.");
    }
}
