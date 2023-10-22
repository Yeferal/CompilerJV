import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { DataArray } from "./data-array";

export class AsignationArray extends Node {
    private _isConst: boolean;
    private _DynamicDataType: DynamicDataType;
    private _id: string;
    private _asignation: DataArray;
    private _dimensions: Array<Node>;
    private _sizeArray: number; // Tamanio total del arreglo, pero creo que no se va usar porque no es necesario calcularlo
    private _isParama: boolean = false;


	constructor(positionToken: PositionToken, toke: string, isConst: boolean, DynamicDataType: DynamicDataType, id: string, asignation: DataArray, dimensions: Array<Node>, sizeArray: number, isParama: boolean ) {
		super(positionToken, null, toke);
        this._isConst = isConst;
		this._DynamicDataType = DynamicDataType;
		this._id = id;
		this._asignation = asignation;
		this._dimensions = dimensions;
		this._sizeArray = sizeArray;
		this._isParama = isParama;
	}


    /**
     * Getter isConst
     * @return {boolean}
     */
	public get isConst(): boolean {
		return this._isConst;
	}

    /**
     * Getter DynamicDataType
     * @return {DynamicDataType}
     */
	public get DynamicDataType(): DynamicDataType {
		return this._DynamicDataType;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter asignation
     * @return {DataArray}
     */
	public get asignation(): DataArray {
		return this._asignation;
	}

    /**
     * Getter dimensions
     * @return {Array<Node>}
     */
	public get dimensions(): Array<Node> {
		return this._dimensions;
	}

    /**
     * Getter sizeArray
     * @return {number}
     */
	public get sizeArray(): number {
		return this._sizeArray;
	}

    /**
     * Getter isParama
     * @return {boolean }
     */
	public get isParama(): boolean  {
		return this._isParama;
	}

    /**
     * Setter isConst
     * @param {boolean} value
     */
	public set isConst(value: boolean) {
		this._isConst = value;
	}

    /**
     * Setter DynamicDataType
     * @param {DynamicDataType} value
     */
	public set DynamicDataType(value: DynamicDataType) {
		this._DynamicDataType = value;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter asignation
     * @param {DataArray} value
     */
	public set asignation(value: DataArray) {
		this._asignation = value;
	}

    /**
     * Setter dimensions
     * @param {Array<Node>} value
     */
	public set dimensions(value: Array<Node>) {
		this._dimensions = value;
	}

    /**
     * Setter sizeArray
     * @param {number} value
     */
	public set sizeArray(value: number) {
		this._sizeArray = value;
	}

    /**
     * Setter isParama
     * @param {boolean } value
     */
	public set isParama(value: boolean ) {
		this._isParama = value;
	}


    public isTypeCorrect(typeAsig: SymbolType): boolean{
        const typesCorrect = [SymbolType.ATRIBUT, SymbolType.KEY_WORD, SymbolType.PARAM, SymbolType.VAR];
        return typesCorrect.includes(typeAsig);
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resName = handlerComprobation.symbolTable.searchSymbol(this.id);
        if (!resName) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        } else {
            this.type = resName.type;
            
            if (!resName.isArray) {
                //error de tipo de simbolo, no es un arreglo
                const errorGramm = new ErrorGramm(this.positionToken, this.toke, `La variable << ${this.id}>> no es un arreglo.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
            }

            if (!this.isTypeCorrect(resName.symbolType)) {
                //error de tipo de simbolo, no es un simbolo de tipo variable asignable
                const errorGramm = new ErrorGramm(this.positionToken, this.toke, `La simbolo << ${this.id}>> no es una variable, atributo o parametro.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
            } else {
                //Verificamos que no se una constante
                if (resName.isConst) {
                    //error porque es una constante que no puede ser cambiada
                    const errorGramm = new ErrorGramm(this.positionToken, this.toke, `La variable es una constante: << ${this.id}>>, no es asignable.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    // return this.type;
                }
            }
        }

        const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resAsig) {
            if ( this.type == resAsig) {
                //En caso de que sea una asignacion por medio de una variable
                if (this.asignation instanceof Identifier) {
                    const identifier: Identifier = this.asignation as Identifier;
                    const symbolIdentifier = handlerComprobation.symbolTable.searchSymbol(identifier.id);
                    if (!symbolIdentifier.isArray) {
                        //error de tipo de simbolo, no es un arreglo
                        const errorGramm = new ErrorGramm(this.positionToken, this.toke, `La simbolo << ${identifier.id}>> no es una variable de tipo arreglo.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                    }
                }

                return this.type;
            } else {
                //Verificar si la asignation es posible, por ejemplo que se de tipo int y que la asignation sea un char lo cual se puede
                const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
                if (!resVeri) {
                    //error
                    const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la asignacion << ${this.toke} ${this.asignation.toke} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignation.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                }
            }
        }else {
            //error
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la asignacion << ${this.toke} ${this.asignation.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
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
