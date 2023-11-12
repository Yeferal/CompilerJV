import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { CallArray } from "./call-array";
import { CallFunction } from "./call-function";
import { CallFunctionObject } from "./call-function-object";
import { CallValueObject } from "./call-value-object";
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";

export class AsignationArray extends Node {

    private _id: string;
    private _dimensions: Array<Node>;
    private _asignation: Node;
    private _sizeArray: number; // Tamanio total del arreglo, pero creo que no se va usar porque no es necesario calcularlo
    private _isThis: boolean;

	constructor(positionToken: PositionToken, toke: string, id: string, dimensions: Array<Node>, asignation: Node, isThis: boolean) {
		super(positionToken, null, toke);
        this._id = id;
		this._dimensions = dimensions;
		this._asignation = asignation;
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
     * Getter dimensions
     * @return {Array<Node>}
     */
	public get dimensions(): Array<Node> {
		return this._dimensions;
	}

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Getter sizeArray
     * @return {number}
     */
	public get sizeArray(): number {
		return this._sizeArray;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter dimensions
     * @param {Array<Node>} value
     */
	public set dimensions(value: Array<Node>) {
		this._dimensions = value;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
	}

    /**
     * Setter sizeArray
     * @param {number} value
     */
	public set sizeArray(value: number) {
		this._sizeArray = value;
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
        const typesCorrect = [SymbolType.ATRIBUT, SymbolType.KEY_WORD, SymbolType.PARAM, SymbolType.VAR];
        return typesCorrect.includes(typeAsig);
    }

    public getNumDims(handlerComprobation: HandlerComprobation, listNode: Array<Node>): number {
        let levelFlag: number = 0;
        if (listNode!=null) {
            for (let i = 0; i < listNode.length; i++) {
                if (listNode[i] instanceof DataArray) {
                    let dataArray: DataArray = listNode[i] as DataArray;
                    if (i == 0) {
                        levelFlag = this.getNumDims(handlerComprobation, dataArray.contentList) + 1;
                        // return dimCount + 1;
                    } else {
                        const level = this.getNumDims(handlerComprobation, dataArray.contentList) + 1;
                        if (levelFlag != level) {
                            //Error de unicidad o dimensiones
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de valores de los arreglos no son congruentes.`, ErrorType.SEMANTIC);
                            handlerComprobation.listError.push(errorGramm);
                            return 0;
                        }
                    }
                } else {
                    return 1;
                }
            }
        }
        return levelFlag;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //is es this entonces que lo busque como un atributo
        let symbol = null;
        if (this.isThis) {
            symbol = handlerComprobation.searchSymbolThis(this.id);
            
        } else {
            symbol = handlerComprobation.searchSymbol(this.id);
        }

        if (symbol == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `No existe una variable con el nombre << ${this.id} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (symbol.isArray==null || !symbol.isArray) {
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `El symbolo << ${this.id} >> no es un arreglo.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        this.type = symbol.type;

        if (symbol.isConst) {
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `El symbolo << ${this.id} >> es de tipo final, no puede ser modificado.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        //Comprobacion de los dims
        for (let i = 0; i < this.dimensions.length; i++) {
            const resDim = this.dimensions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (resDim == null || resDim.name != "INTEGER") {
                const errorGramm = new ErrorGramm(this.positionToken, this.dimensions[i].token, `Los valores de la asignacion deben ser valores enteros << ${this.dimensions[i].token} >>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        }

        const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resAsig == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        } else {
            
            if (this.type.name != resAsig.name) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        }


        if (this.asignation instanceof DataArray) {
            const errorGramm = new ErrorGramm(this.asignation.positionToken, this.asignation.token, `La asignacion no es valida.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        } else if (this.asignation instanceof InstanceArray) {
            const errorGramm = new ErrorGramm(this.asignation.positionToken, this.asignation.token, `La asignacion no es valida.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;

        }  else { // else: para ver si es una asignacion de una variable eje -> int arr2 [][] = arr1;
            if (this.asignation instanceof Identifier) {
                //Buscar el la variable, verificar las comprobaciones y verificar que sea un arreglo del mismo numero de dimensiones
                const identifier = this.asignation as Identifier;
                const symbol = handlerComprobation.searchSymbol(identifier.id);
                if (symbol.isArray!=null && symbol.isArray && this.dimensions.length == symbol.numDims) {
                    const errorGramm = new ErrorGramm(identifier.positionToken, identifier.token, `La variable << ${identifier.id} >> no es compatible con la asingacion del arreglo << ${this.id} >>.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                } else {
                }
            } else if (this.asignation instanceof CallArray){

            } else if (this.asignation instanceof CallFunction){

            } else if (this.asignation instanceof CallFunctionObject){

            } else if (this.asignation instanceof CallValueObject){

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
        // throw new Error("Method not implemented.");
    }
}
