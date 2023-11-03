import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";

export class AsignationVar extends Node {
    private _id: string;
    private _asignation: Node;
    private _isThis: boolean;
    private _isArray: boolean;

	constructor(positionToken: PositionToken, token: string, id: string, asignation: Node, isThis: boolean, isArray: boolean) {
        super(positionToken, null, token);
		this._id = id;
		this._asignation = asignation;
        this._isThis = isThis;
        this._isArray = isArray;
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

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
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

    /**
     * Getter isArray
     * @return {boolean}
     */
	public get isArray(): boolean {
		return this._isArray;
	}

    /**
     * Setter isArray
     * @param {boolean} value
     */
	public set isArray(value: boolean) {
		this._isArray = value;
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

    public getDimArray(handlerComprobation: HandlerComprobation, listNode: Array<Node>): Array<number>{
        let dimCount: number = 0;
        let listDimTemp: Array<number> = new Array<number>;
        if (listNode!=null) {
            for (let i = 0; i < listNode.length; i++) {
                if (listNode[i] instanceof DataArray) {
                    let dataArray: DataArray = listNode[i] as DataArray;
                    if (i == 0) {
                        dimCount = dataArray.contentList.length;
                        let listTemp: Array<number> = this.getDimArray(handlerComprobation, dataArray.contentList);
                        listDimTemp = listTemp;
                    } else {
                        if (dimCount != dataArray.contentList.length) {
                            //Error de unicidad o dimensiones
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de valores de los arreglos no son congruentes.`, ErrorType.SEMANTIC);
                            handlerComprobation.listError.push(errorGramm);
                            break;
                        }
                        this.getDimArray(handlerComprobation, dataArray.contentList);
                    }
                } else {
                    dimCount = listNode.length;
                    listDimTemp.push(dimCount);
                    return listDimTemp;
                }
            }
            listDimTemp.push(listNode.length);
        }

        return listDimTemp;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
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

        const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resAsig) {
            if ( this.type.name == resAsig.name) {
                //En caso de que sea una asignacion por medio de una variable
                if (this.asignation instanceof Identifier) {
                    const identifier: Identifier = this.asignation as Identifier;
                    const symbolIdentifier = handlerComprobation.searchSymbol(identifier.id);
                    if (symbolIdentifier.isArray && !symbol.isArray) {
                        //error de tipo de simbolo, no es un arreglo
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `La simbolo << ${identifier.id}>> es un variable de tipo arreglo.`, ErrorType.SEMANTIC);
                        handlerComprobation.listError.push(errorGramm);
                    }
                }

                if (symbol.isArray!= null && symbol.isArray) {
                    if (this.asignation instanceof DataArray) {
                        const dataArray: DataArray = this.asignation as DataArray;
                        const numDims = this.getNumDims(handlerComprobation, dataArray.contentList);
                        if (symbol.numDims !== numDims) {
                            const errorGramm = new ErrorGramm(dataArray.positionToken, dataArray.token, `El numero de dimensiones validas para el arreglo son distintas del numero de la asignacion.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                            
                        }
                    } else if (this.asignation instanceof InstanceArray) {
                        const asig = this.asignation as InstanceArray;
                        const numDims = asig.dims.length;
                        if (symbol.numDims !== numDims) {
                            const errorGramm = new ErrorGramm(asig.positionToken, asig.token, `El numero de dimensiones validas para el arreglo son distintas del numero de la asignacion.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                            
                        }
    
                    } else {
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `La simbolo << ${this.id}>> es un variable de tipo arreglo.`, ErrorType.SEMANTIC);
                        handlerComprobation.listError.push(errorGramm);
                    }
                }
                

                return this.type;
            } else {
                //Verificar si la asignation es posible, por ejemplo que se de tipo int y que la asignation sea un char lo cual se puede
                const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
                if (!resVeri) {
                    //error
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignation.`, ErrorType.SEMANTIC);
                    handlerComprobation.listError.push(errorGramm);
                }
            }
        }else {
            //error
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
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
