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

export class DeclarationVar extends Node {

    private _isFinal: boolean;

    private _id: string;
    private _asignation: Node;
    private _isReference: boolean = false;

	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, id: string, asignation: Node) {
		super(positionToken, type, toke);
		this._id = id;
		this._asignation = asignation;
	}


    /**
     * Getter isFinal
     * @return {boolean}
     */
	public get isFinal(): boolean {
		return this._isFinal;
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
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Getter isReference
     * @return {boolean }
     */
	public get isReference(): boolean  {
		return this._isReference;
	}

    /**
     * Setter isFinal
     * @param {boolean} value
     */
	public set isFinal(value: boolean) {
		this._isFinal = value;
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
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
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
            this.id,                                //nameCode
            this.id,                                //name
            SymbolType.VAR,                         //symbolType
            false,                                  //isFunction
            this.type,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,                                      //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            this.isReference,                       //isReference
            EncapsulationType.PUBLIC,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            this.isFinal                            //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();

        handlerComprobation.symbolTable.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Verifica que no exista otra simbolo con el mismo nombre
        const resName = handlerComprobation.symbolTable.searchSymbol(this.id);

        //Falta agregar si el simbolo es un parametro entonces que use el this como referencia
        if (resName) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        }

        //Verificar el tipo de asignacion
        if (this.asignation) {
            const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (resAsig) {
                if ( this.type == resAsig) {
                    //Agreagar a la tabla de simbolos
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else {
                    //Verificar si la asignacion es posible, por ejemplo que se de tipo int y que la asignacion sea un char lo cual se puede
                    const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
                    if (resVeri) {
                        //Agreagar a la tabla de simbolos
                        this.addSymbol(handlerComprobation);
                        return this.type;
                    }
                    //error
                    const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la asignacion << ${this.toke} ${this.asignation.toke} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignacion.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);

                }
            }else {
                //error
                const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la asignacion << ${this.toke} ${this.asignation.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
            }
        } else {
            //Agreagar a la tabla de simbolos
            this.addSymbol(handlerComprobation);
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
