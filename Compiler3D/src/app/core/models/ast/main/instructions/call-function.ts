import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";

export class CallFunction extends Node {
    private _id: string;
    private _params: Array<Node>;
    private _isThis: boolean;

	constructor(positionToken: PositionToken, token: string, id: string, params: Array<Node>, isThis: boolean) {
        super(positionToken, null, token);
		this._id = id;
		this._params = params;
        this._isThis = isThis;
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

    
    public isTypeCorrect(typeAsig: SymbolType): boolean{
        const typesCorrect = [SymbolType.FUNCTION, SymbolType.PROCEDURE, SymbolType.VOID];
        return typesCorrect.includes(typeAsig);
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //buscar la funciones para comprobar si existe
        const symbolFunc = handlerComprobation.searchSymbol(this.id);
        this.type = symbolFunc.type;

        //Verificar que sea una funcion o procedimiento
        if (!this.isTypeCorrect(symbolFunc.symbolType)) {
            //Erro no es una funcion o procedimiento
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe una funcion o procedimiento << ${this.id} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return this.type;
        }

        //Ejecutar las comprobaciones para obtener los tipos de datos de los parametros
        let listParamsOfNode = new Array<DynamicDataType>;
        for (let i = 0; i < this.params.length; i++) {
            listParamsOfNode.push(this.params[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation));
        }

        if (this.params.length != symbolFunc.listParams.length) {
            //Error el numero de parametros no coincide
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros no coincide en la funcion << ${this.token} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        } else {
            //Comprara que el tipo de dato de los parametros sea el mismo
            if (this.params.length > 0) {
                const paramSymbol = symbolFunc.listParams;
                for (let i = 0; i < listParamsOfNode.length; i++) {
                    if (listParamsOfNode[i] != paramSymbol[i]) {
                        //Error no son del mismo tipo
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros no coincide en la funcion << ${this.token} >>.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                    }
                }
            }
        }

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
