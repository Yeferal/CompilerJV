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
import { CallArray } from "./call-array";
import { CallFunction } from "./call-function";
import { CallFunctionObject } from "./call-function-object";
import { CallValueObject } from "./call-value-object";
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";

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

	public get isGetter(): boolean {
		return this._isGetter;
	}

	public get isSetter(): boolean {
		return this._isSetter;
	}

	public get encapsulationType(): EncapsulationType {
		return this._encapsulationType;
	}

	public get isFinal(): boolean {
		return this._isFinal;
	}

	public get isStatic(): boolean {
		return this._isStatic;
	}

	public get id(): string {
		return this._id;
	}

	public get asignation(): Node {
		return this._asignation;
	}

	public get dimensions(): number {
		return this._dimensions;
	}

	public get sizeArray(): number {
		return this._sizeArray;
	}

	public get isAtrib(): boolean {
		return this._isAtrib;
	}

	public set isAtrib(value: boolean) {
		this._isAtrib = value;
	}

	public get listDims(): Array<number> {
		return this._listDims;
	}

	public set isGetter(value: boolean) {
		this._isGetter = value;
	}

	public set isSetter(value: boolean) {
		this._isSetter = value;
	}

	public set encapsulationType(value: EncapsulationType) {
		this._encapsulationType = value;
	}

	public set isFinal(value: boolean) {
		this._isFinal = value;
	}

	public set isStatic(value: boolean) {
		this._isStatic = value;
	}

	public set id(value: string) {
		this._id = value;
	}

	public set asignation(value: Node) {
		this._asignation = value;
	}

	public set dimensions(value: number) {
		this._dimensions = value;
	}

	public set sizeArray(value: number) {
		this._sizeArray = value;
	}

	public set listDims(value: Array<number>) {
		this._listDims = value;
	}

	public get isReference(): boolean  {
		return this._isReference;
	}

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
            null,                                //nameCode
            this.id,                                //name
            this.isAtrib? SymbolType.ATRIBUT: SymbolType.VAR, //symbolType
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
        newSymbol.numDims = this.dimensions;

        handlerComprobation.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        if (this.type == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El token o id << ${this.id}>>, no tine tipo de dato.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
        //Verifica que no exista otro simbolo con el mismo nombre
        const resName = handlerComprobation.searchSymbol(this.id);
        if (resName != null) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
        }
        //Comprobamos los getter y setters, static, final, encapsulamiento
        if (this.isStatic || this.isFinal) {
            if (this.isGetter || this.isSetter) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los decaradores getter y setter no pueden se usados en declaraciones static o final<< ${this.id}>>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        }

        if (this.isFinal && this.asignation == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Una declaracion final debe de tener un valor de asignacion << ${this.id}>>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.encapsulationType != EncapsulationType.PRIVATE) {
            if (this.isGetter || this.isSetter) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los decaradores getter y setter solo pueden ser usados con encapsulamiento private << ${this.id}>>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        }

        if (!handlerComprobation.isExistType(this.type.name)) {  
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato << ${this.type.name}>> no existe.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isGetter) {
            handlerComprobation.listGetters.push(this);
        }
        if (this.isSetter) {
            handlerComprobation.listSetters.push(this);
        }

        if (this.asignation != null) {
            //FASE 1 Y FASE 2
            const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (resAsig != null) {
                if ( this.type.name == resAsig.name) {
                    //Fase 3: Contar u obtner el numero de dimensiones de toda la data
                    if (this.asignation instanceof DataArray) {
                        const dataArray: DataArray = this.asignation as DataArray;
                        const numDims = this.getNumDims(handlerComprobation, dataArray.contentList);
                        if (this.dimensions !== numDims) {
                            const errorGramm = new ErrorGramm(dataArray.positionToken, dataArray.token, `El numero de dimensiones validas para el arreglo son distintas del numero de la asignacion.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                            
                        } else {
                            //Agreagar a la tabla de simbolos
                            this.listDims = this.getDimArray(handlerComprobation, dataArray.contentList);
                            this.listDims.reverse();
                            this.addSymbol(handlerComprobation);

                        }
                    } else if (this.asignation instanceof InstanceArray) {
                        const asig = this.asignation as InstanceArray;
                        const numDims = asig.dims.length;
                        if (this.dimensions !== numDims) {
                            const errorGramm = new ErrorGramm(asig.positionToken, asig.token, `El numero de dimensiones validas para el arreglo son distintas del numero de la asignacion.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                            
                        } else {
                            //Agreagar a la tabla de simbolos
                            //NO podemos definir el listDims porque son variables
                            // this.listDims = this.getDimArray(handlerComprobation, dataArray.contentList);
                            this.addSymbol(handlerComprobation);

                        }

                    }  else { // else: para ver si es una asignacion de una variable eje -> int arr2 [][] = arr1;
                        if (this.asignation instanceof Identifier) {
                            //Buscar el la variable, verificar las comprobaciones y verificar que sea un arreglo del mismo numero de dimensiones
                            const identifier = this.asignation as Identifier;
                            const symbol = handlerComprobation.searchSymbol(identifier.id);
                            if (symbol.isArray && this.dimensions == symbol.numDims) {
                                this.listDims = symbol.listDims;
                                this.addSymbol(handlerComprobation);
                            } else {
                                const errorGramm = new ErrorGramm(identifier.positionToken, identifier.token, `La variable << ${identifier.id} >> no es compatible con la asingacion del arreglo << ${this.id} >>.`, ErrorType.SEMANTIC); 
                                handlerComprobation.listError.push(errorGramm);
                                return ;
                            }
                        } else if (this.asignation instanceof CallArray){

                            
                        } else if (this.asignation instanceof CallFunction){

                        } else if (this.asignation instanceof CallFunctionObject){

                        } else if (this.asignation instanceof CallValueObject){

                        } else {
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                        }
                    }
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
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignacion.`, ErrorType.SEMANTIC);
                    handlerComprobation.listError.push(errorGramm);

                }
            } else {
                //error
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
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
        
    }
}
