import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";

export class InputNode extends Node {
    private _id: string;

	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, id: string) {
        super(positionToken, type, toke);
        this._id = id;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const symbol = handlerComprobation.searchSymbol(this.id);
        if (symbol == null) {
            //si no existe crea un error y lo agrega a la lista de errores
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `No existe una variable con el nombre << ${this.id} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.type.name != symbol.type.name) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << input${this.type.name} => ${this.id} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato del input.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
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
