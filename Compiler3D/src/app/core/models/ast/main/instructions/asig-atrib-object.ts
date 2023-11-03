import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";

export class AsigAtribObject extends Node {

    private _idObj: string;
    private _idAtrib: string;
    private _asignation: Node;
    private _isThis: boolean;
    private _isArray: boolean;


	constructor(positionToken: PositionToken, token: string, idObj: string, idAtrib: string, asignation: Node, isThis: boolean, isArray: boolean) {
		super(positionToken, null, token);
        this._idObj = idObj;
		this._idAtrib = idAtrib;
		this._asignation = asignation;
		this._isThis = isThis;
		this._isArray = isArray;
	}

    /**
     * Getter idObj
     * @return {string}
     */
	public get idObj(): string {
		return this._idObj;
	}

    /**
     * Getter idAtrib
     * @return {string}
     */
	public get idAtrib(): string {
		return this._idAtrib;
	}

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Getter isThis
     * @return {boolean}
     */
	public get isThis(): boolean {
		return this._isThis;
	}

    /**
     * Getter isArray
     * @return {boolean}
     */
	public get isArray(): boolean {
		return this._isArray;
	}

    /**
     * Setter idObj
     * @param {string} value
     */
	public set idObj(value: string) {
		this._idObj = value;
	}

    /**
     * Setter idAtrib
     * @param {string} value
     */
	public set idAtrib(value: string) {
		this._idAtrib = value;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
	}

    /**
     * Setter isThis
     * @param {boolean} value
     */
	public set isThis(value: boolean) {
		this._isThis = value;
	}

    /**
     * Setter isArray
     * @param {boolean} value
     */
	public set isArray(value: boolean) {
		this._isArray = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //buscar el objeto en la tabla de tipos por ambitos
        //is es this entonces que lo busque como un atributo
        let symbolObj = null;
        if (this.isThis) {
            symbolObj = handlerComprobation.searchSymbolThis(this.idObj);
            
        } else {
            symbolObj = handlerComprobation.searchSymbol(this.idObj);
        }

        if (symbolObj == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `No existe una variable con el nombre << ${this.idObj} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isArray && (symbolObj.isArray==null || !symbolObj.isArray)) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo << ${this.idObj} >> no es un arreglo.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
        this.type = symbolObj.type;
        

        //buscar el atributo en la tabla de tipos general
        const symbolAtrib = handlerComprobation.searchSymbolAtribClass(this.idAtrib, symbolObj.type.name);

        if (symbolAtrib == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `No existe el atribuyo con el nombre << ${this.idAtrib} >> dentro de la clase ${symbolObj.type.name}.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isArray && (symbolAtrib==null || !symbolAtrib.isArray)) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (symbolAtrib.isConst) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo atributo << ${this.idAtrib} >> es de tipo final, no puede ser modificado.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resAsig == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.type.name != resAsig.name) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isArray) {
            if (this.asignation instanceof DataArray) {
                return ;
            } else if (this.asignation instanceof InstanceArray) {
                return ;
            } else if (this.asignation instanceof Identifier) {
                const identifier = this.asignation as Identifier;
                const symbolId = handlerComprobation.searchSymbol(identifier.id);
                if (symbolId.isArray == null || !symbolId.isArray) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
            } else {
                const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        } else {
            if (this.asignation instanceof DataArray) {
                const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            } else if (this.asignation instanceof InstanceArray) {
                const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            } else if (this.asignation instanceof Identifier) {
                const identifier = this.asignation as Identifier;
                const symbolId = handlerComprobation.searchSymbol(identifier.id);
                if (symbolId.isArray != null && symbolId.isArray) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
            }
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
        throw new Error("Method not implemented.");
    }
}
