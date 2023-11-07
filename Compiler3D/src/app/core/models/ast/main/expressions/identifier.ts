import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";

export class Identifier extends Node{
    private _id: string;
    private _value: any;
    private _isThis: boolean;

    constructor(positionToken: PositionToken, toke: string, id: any, isThis: boolean) {
        super(positionToken, null, toke);
		this._id = id;
        this._isThis = isThis;
	}

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
    }

    /**
     * Getter isThis
     * @return {boolean}
     */
	public get isThis(): boolean {
		return this._isThis;
	}

    /**
     * Setter isThis
     * @param {boolean} value
     */
	public set isThis(value: boolean) {
		this._isThis = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Busca la variable en la tabla se simbolos
        //comprobacion de ambito y nombre
        let symbol = null;
        if (this.isThis) {
            symbol = handlerComprobation.searchSymbolAtribClass(this.id, handlerComprobation.actualClass.name);
        } else {
            symbol = handlerComprobation.searchSymbol(this.id);
        }
        
        //si existe la variable, retorna el tipo de dato de la variable
        // console.log(symbol);
        
        if (symbol != null) {
            this.type = symbol.type;
            return symbol.type;
        }else {
            //si no existe crea un error y lo agrega a la lista de errores
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `No existe una variable con el nombre << ${this.id} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
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
