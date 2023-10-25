import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";
import { DataArray } from "./data-array";

export class DeclarationArray extends Node{

    //Atributos propios de una Declaracion de un Atributo
    private _isGetter: boolean;
    private _isSetter: boolean;
    private _encapsulationType: EncapsulationType;

    //Atributos de una Variable o Atributo
    private _isFinal: boolean;
    private _isStatic: boolean;
    private _id: string;
    private _asignation: Node;
    private _dimensions: number;
    private _isAtrib: boolean;
    private _sizeArray: number; // Tamanio total del arreglo, pero creo que no se va usar porque no es necesario calcularlo
    private _listDims: Array<number>; // new type[3][2]...[x]
    private _isReference: boolean = false;

	constructor(positionToken: PositionToken, type: DynamicDataType, token: string, id: string, asignation: Node, dimensions: number, isAtrib: boolean) {
		super(positionToken, type, token);
        this._id = id;
        this._asignation = asignation;
        this._dimensions = dimensions;
        this._isAtrib = isAtrib;
	}

    /**
     * Getter isGetter
     * @return {boolean}
     */
	public get isGetter(): boolean {
		return this._isGetter;
	}

    /**
     * Getter isSetter
     * @return {boolean}
     */
	public get isSetter(): boolean {
		return this._isSetter;
	}

    /**
     * Getter encapsulationType
     * @return {EncapsulationType}
     */
	public get encapsulationType(): EncapsulationType {
		return this._encapsulationType;
	}

    /**
     * Getter isFinal
     * @return {boolean}
     */
	public get isFinal(): boolean {
		return this._isFinal;
	}

    /**
     * Getter isStatic
     * @return {boolean}
     */
	public get isStatic(): boolean {
		return this._isStatic;
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
     * Getter dimensions
     * @return {number}
     */
	public get dimensions(): number {
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
     * Getter isAtrib
     * @return {boolean}
     */
	public get isAtrib(): boolean {
		return this._isAtrib;
	}

    /**
     * Setter isAtrib
     * @param {boolean} value
     */
	public set isAtrib(value: boolean) {
		this._isAtrib = value;
	}


    /**
     * Getter listDims
     * @return {Array<number>}
     */
	public get listDims(): Array<number> {
		return this._listDims;
	}

    /**
     * Setter isGetter
     * @param {boolean} value
     */
	public set isGetter(value: boolean) {
		this._isGetter = value;
	}

    /**
     * Setter isSetter
     * @param {boolean} value
     */
	public set isSetter(value: boolean) {
		this._isSetter = value;
	}

    /**
     * Setter encapsulationType
     * @param {EncapsulationType} value
     */
	public set encapsulationType(value: EncapsulationType) {
		this._encapsulationType = value;
	}

    /**
     * Setter isFinal
     * @param {boolean} value
     */
	public set isFinal(value: boolean) {
		this._isFinal = value;
	}

    /**
     * Setter isStatic
     * @param {boolean} value
     */
	public set isStatic(value: boolean) {
		this._isStatic = value;
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
     * Setter dimensions
     * @param {number} value
     */
	public set dimensions(value: number) {
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
     * Setter listDims
     * @param {Array<number>} value
     */
	public set listDims(value: Array<number>) {
		this._listDims = value;
	}


    /**
     * Getter isReference
     * @return {boolean }
     */
	public get isReference(): boolean  {
		return this._isReference;
	}

    /**
     * Setter isReference
     * @param {boolean } value
     */
	public set isReference(value: boolean ) {
		this._isReference = value;
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
            true,                                  //isArray
            this.listDims,                          //listDims
            this.isReference,                       //isReference
            this.encapsulationType,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            this.isFinal                           //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();
        newSymbol.listDims = this.listDims;

        handlerComprobation.symbolTable.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Verifica que no exista otra simbolo con el mismo nombre
        const resName = handlerComprobation.symbolTable.searchSymbol(this.id);
        if (resName) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
        }

        //Comprobacion de las dimensiones [?] [?] [?]...[?]
        // if (this.dimensions.length>0) {
        //     for (let i = 0; i < this.dimensions.length; i++) {
        //         const element = this.dimensions[i];
        //         const dimType = element.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        //         if (dimType != this.type) {
        //             //Error el parametro de la dimension no es un entero
        //             const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El tipo de valor del parametro de la dimension del arreglo no es un ENTERO.`, ErrorType.SEMANTIC);
        //             handlerComprobation.listError.push(errorGramm);
        //         }else {
        //             this.listDims.push(1);
        //         }
        //     }
        // }

        // if (this.asignation) {
        //     //FASE 1 Y FASE 2
        //     const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        //     if (resAsig) {
        //         if ( this.type == resAsig) {
        //             //Fase 3: Contar u obtner el numero de dimensiones de toda la data
        //             if (this.asignation instanceof DataArray) {
        //                 const dataArray: DataArray = this.asignation as DataArray;
        //                 const numDims = this.getNumDims(handlerComprobation, dataArray.contentList);
        //                 if (numDims != this.dimensions.length) {
        //                     //Erro el numero de dimensiones no es igual al numero de niveles del la asignacion
        //                     const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El numero de dimensiones no es igual al numero de niveles del la asignacion.`, ErrorType.SEMANTIC);
        //                     handlerComprobation.listError.push(errorGramm);
        //                 } else {
        //                     //Agreagar a la tabla de simbolos
        //                     this.listDims = this.getDimArray(handlerComprobation, dataArray.contentList);
        //                     this.addSymbol(handlerComprobation);

        //                 }
        //             } else { // else: para ver si es una asignacion de una variable eje -> int arr2 [][] = arr1;
        //                 if (this.asignation instanceof Identifier) {
        //                     //Buscar el la variable, verificar las comprobaciones y verificar que sea un arreglo del mismo numero de dimensiones

        //                     //Agreagar a la tabla de simbolos

        //                     this.addSymbol(handlerComprobation);
        //                 }
        //             }
        //             return this.type;
        //         } else {
        //             //Verificar si la asignacion es posible, por ejemplo que se de tipo int y que la asignacion sea un char lo cual se puede
        //             const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
        //             if (resVeri) {
        //                 //Agreagar a la tabla de simbolos

        //                 this.addSymbol(handlerComprobation);
        //                 return this.type;
        //             }
        //             //error
        //             const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la asignacion << ${this.toke} ${this.asignation.toke} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignacion.`, ErrorType.SEMANTIC);
        //             handlerComprobation.listError.push(errorGramm);

        //         }
        //     }else {
        //         //error
        //         const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la asignacion << ${this.toke} ${this.asignation.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
        //         handlerComprobation.listError.push(errorGramm);
        //     }
        // } else {
        //     //Agreagar a la tabla de simbolos
        //     this.addSymbol(handlerComprobation);
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
