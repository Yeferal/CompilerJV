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

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        // const resName = handlerComprobation.symbolTable.searchSymbol(this.id);
        // if (!resName) {
        //     //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
        //     const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
        //     handlerComprobation.listError.push(errorGramm);
        // } else {
        //     this.type = resName.type;
            
        //     if (!resName.isArray) {
        //         //error de tipo de simbolo, no es un arreglo
        //         const errorGramm = new ErrorGramm(this.positionToken, this.token, `La variable << ${this.id}>> no es un arreglo.`, ErrorType.SEMANTIC); 
        //         handlerComprobation.listError.push(errorGramm);
        //     }

        //     if (!this.isTypeCorrect(resName.symbolType)) {
        //         //error de tipo de simbolo, no es un simbolo de tipo variable asignable
        //         const errorGramm = new ErrorGramm(this.positionToken, this.token, `La simbolo << ${this.id}>> no es una variable, atributo o parametro.`, ErrorType.SEMANTIC); 
        //         handlerComprobation.listError.push(errorGramm);
        //     } else {
        //         //Verificamos que no se una constante
        //         if (resName.isConst) {
        //             //error porque es una constante que no puede ser cambiada
        //             const errorGramm = new ErrorGramm(this.positionToken, this.token, `La variable es una constante: << ${this.id}>>, no es asignable.`, ErrorType.SEMANTIC); 
        //             handlerComprobation.listError.push(errorGramm);
        //             // return this.type;
        //         }
        //     }
        // }

        // const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        // if (resAsig) {
        //     if ( this.type == resAsig) {
        //         //En caso de que sea una asignacion por medio de una variable
        //         if (this.asignation instanceof Identifier) {
        //             const identifier: Identifier = this.asignation as Identifier;
        //             const symbolIdentifier = handlerComprobation.symbolTable.searchSymbol(identifier.id);
        //             if (!symbolIdentifier.isArray) {
        //                 //error de tipo de simbolo, no es un arreglo
        //                 const errorGramm = new ErrorGramm(this.positionToken, this.token, `La simbolo << ${identifier.id}>> no es una variable de tipo arreglo.`, ErrorType.SEMANTIC); 
        //                 handlerComprobation.listError.push(errorGramm);
        //             }
        //         }

        //         return this.type;
        //     } else {
        //         //Verificar si la asignation es posible, por ejemplo que se de tipo int y que la asignation sea un char lo cual se puede
        //         const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
        //         if (!resVeri) {
        //             //error
        //             const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.toke} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignation.`, ErrorType.SEMANTIC); 
        //             handlerComprobation.listError.push(errorGramm);
        //         }
        //     }
        // }else {
        //     //error
        //     const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
        //     handlerComprobation.listError.push(errorGramm);
        // }
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
