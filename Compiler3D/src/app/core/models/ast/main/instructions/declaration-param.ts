import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";

export class DeclarationParam extends Node {

    private _id: string;
    private _dimensions: number;
    private _isArray: boolean;
    private _isReference: boolean = true;

	constructor(positionToken: PositionToken, type: DynamicDataType, token: string, id: string, dimensions: number, isArray: boolean) {
		super(positionToken, type, token);
        this._id = id;
		this._dimensions = dimensions;
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
     * Getter dimensions
     * @return {number}
     */
	public get dimensions(): number {
		return this._dimensions;
	}

    /**
     * Getter isArray
     * @return {boolean}
     */
	public get isArray(): boolean {
		return this._isArray;
	}

    /**
     * Getter isReference
     * @return {boolean }
     */
	public get isReference(): boolean  {
		return this._isReference;
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
     * @param {number} value
     */
	public set dimensions(value: number) {
		this._dimensions = value;
	}

    /**
     * Setter isArray
     * @param {boolean} value
     */
	public set isArray(value: boolean) {
		this._isArray = value;
	}

    /**
     * Setter isReference
     * @param {boolean } value
     */
	public set isReference(value: boolean ) {
		this._isReference = value;
	}

    public addSymbol(handlerComprobation: HandlerComprobation){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            null,                                //nameCode
            this.id,                                //name
            SymbolType.PARAM,                       //symbolType
            false,                                  //isFunction
            this.type,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,                                      //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            this.isReference,                       //isReference
            null,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            false                           //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();

        handlerComprobation.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Verifica que no exista otra simbolo con el mismo nombre
        const resName = handlerComprobation.searchSymbol(this.id);
        if (resName != null) {
            if (resName.symbolType != SymbolType.ATRIBUT) {
                //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return this.type;
            }
        }

        //Agreagar a la tabla de simbolos
        this.addSymbol(handlerComprobation);
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
