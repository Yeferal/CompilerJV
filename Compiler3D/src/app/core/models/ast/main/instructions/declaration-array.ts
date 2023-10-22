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
import { DataArray } from "./data-array";

export class DeclarationArray extends Node{
    private _isConst: boolean;
    private _DynamicDataType: DynamicDataType;
    private _id: string;
    private _asignation: Node;
    private _dimensions: Array<Node>;
    private _sizeArray: number; // Tamanio total del arreglo, pero creo que no se va usar porque no es necesario calcularlo
    private _encapsulation: string = "public"
    isReference: boolean = false;
    private _listDims: Array<number>;
    
    constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, isConst: boolean, DynamicDataType: DynamicDataType, id: string, dimensions: Array<Node>, asignation: DataArray ) {
		super(positionToken, type, toke);
        this._isConst = isConst;
		this._DynamicDataType = DynamicDataType;
		this._id = id;
        this._dimensions = dimensions;
		this._asignation = asignation;
	}

    public get isConst(): boolean {
        return this._isConst;
    }

    public set isConst(value: boolean) {
        this._isConst = value;
    }

    public get DynamicDataType(): DynamicDataType {
        return this._DynamicDataType;
    }

    public set DynamicDataType(value: DynamicDataType) {
        this._DynamicDataType = value;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get asignation(): Node {
        return this._asignation;
    }

    public set asignation(value: DataArray) {
        this._asignation = value;
    }

    public get dimensions(): Array<Node> {
        return this._dimensions;
    }

    public set dimensions(value: Array<Node>) {
        this._dimensions = value;
    }
    
    public get sizeArray(): number {
        return this._sizeArray;
    }
    
    public set sizeArray(value: number) {
        this._sizeArray = value;
    }

	public get encapsulation(): string  {
		return this._encapsulation;
	}

    public set encapsulation(value: string ) {
		this._encapsulation = value;
	}

	public get listDims(): Array<number> {
		return this._listDims;
	}

    public set listDims(value: Array<number>) {
		this._listDims = value;
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
                            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El numero de valores de los arreglos no son congruentes.`, ErrorType.SEMANTIC); 
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
                            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El numero de valores de los arreglos no son congruentes.`, ErrorType.SEMANTIC); 
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
            this.DynamicDataType,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,                                      //Tamanio del symbol
            true,                                  //isArray
            this.listDims,                          //listDims
            this.isReference,                       //isReference
            this.encapsulation,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            this.isConst                            //isConst
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
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        }

        //Comprobacion de las dimensiones [?] [?] [?]...[?]
        if (this.dimensions.length>0) {
            for (let i = 0; i < this.dimensions.length; i++) {
                const element = this.dimensions[i];
                const dimType = element.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                if (dimType != this.DynamicDataType) {
                    //Error el parametro de la dimension no es un entero
                    const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El tipo de valor del parametro de la dimension del arreglo no es un ENTERO.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                }else {
                    this.listDims.push(1);
                }
            }
        }
        
        if (this.asignation) {
            //FASE 1 Y FASE 2
            const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (resAsig) {
                if ( this.DynamicDataType == resAsig) {
                    //Fase 3: Contar u obtner el numero de dimensiones de toda la data
                    if (this.asignation instanceof DataArray) {
                        const dataArray: DataArray = this.asignation as DataArray;
                        const numDims = this.getNumDims(handlerComprobation, dataArray.contentList);
                        if (numDims != this.dimensions.length) {
                            //Erro el numero de dimensiones no es igual al numero de niveles del la asignacion
                            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El numero de dimensiones no es igual al numero de niveles del la asignacion.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                        } else {
                            //Agreagar a la tabla de simbolos
                            this.listDims = this.getDimArray(handlerComprobation, dataArray.contentList);
                            this.addSymbol(handlerComprobation);

                        }
                    } else { // else: para ver si es una asignacion de una variable eje -> int arr2 [][] = arr1;
                        if (this.asignation instanceof Identifier) {
                            //Buscar el la variable, verificar las comprobaciones y verificar que sea un arreglo del mismo numero de dimensiones

                            //Agreagar a la tabla de simbolos

                            this.addSymbol(handlerComprobation);
                        }
                    }
                    return this.DynamicDataType;
                } else {
                    //Verificar si la asignacion es posible, por ejemplo que se de tipo int y que la asignacion sea un char lo cual se puede
                    const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.DynamicDataType, resAsig);
                    if (resVeri) {
                        //Agreagar a la tabla de simbolos
                        
                        this.addSymbol(handlerComprobation);
                        return this.DynamicDataType;
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
        return this.DynamicDataType;
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
