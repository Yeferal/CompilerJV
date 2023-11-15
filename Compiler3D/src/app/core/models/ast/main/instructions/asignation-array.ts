import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { LogicalOperation } from "../expressions/logical-operation";
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

    private generatePosAsignDim(environment: Environment, listDimsTemp: Array<string>): string{
        let direction = "0";
        let multiplier = "1";

        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de asignacion de arreglos", arg2: null, result: null});
        for (let i = listDimsTemp.length - 1; i >= 0 ; i--) {
            let sizeDim = listDimsTemp[i];
            let coordinate = this.dimensions[i].execute(environment);

            // direccion = direccion + (coordenada * multiplicador);
            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "*i", arg1: coordinate, arg2: multiplier, result: "t"+tTemp});

            const tTemp2 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp2);
            environment.handlerQuartet.insertQuartet({operator: "+i", arg1: direction, arg2: "t"+tTemp, result: "t"+tTemp2});
            direction = "t"+tTemp2;


            // multiplicador = multiplicador * tamañoDimension;
            const tTemp3 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp3);
            environment.handlerQuartet.insertQuartet({operator: "*i", arg1: multiplier, arg2: sizeDim, result: "t"+tTemp3});
            multiplier = "t"+tTemp3
            
        }

        return direction;
    }

    public override execute(environment: Environment): any {
        environment.isAsig = true;
        let tAsig = this.asignation.execute(environment);
        environment.isAsig = false;

        if (this.asignation instanceof LogicalOperation) {
            tAsig = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tAsig);
            tAsig = "t"+tAsig;
            const etJump = environment.addEt();
            if (!environment.etTrue.isEmpty()) {
                while (!environment.etTrue.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etTrue.pop()});
                }
            }
            //Aqui va el valor del t verdadero
            environment.handlerQuartet.insertQuartet({operator: "=", arg1: "1", arg2: null, result: tAsig});
            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etJump});

            if (!environment.etFalse.isEmpty()) {
                while (!environment.etFalse.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etFalse.pop()});
                }
            }
            //Aqui va el valor del t FALSO
            environment.handlerQuartet.insertQuartet({operator: "=", arg1: "0", arg2: null, result: tAsig});
            environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etJump});
        }

        if (this.isThis) {
            const symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
            console.log(symbol);
            
            const tPosition = this.generatePosAsignDim(environment, symbol.listDimsTemps);

            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el This", arg2: null, result: null});

            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTemp});
            
            const tTemp2 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp2);
            environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
            
            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});
            const tTemp3 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp3);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp2, arg2: symbol.direction, result: "t"+tTemp3});

            const tTemp4 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp4);
            environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});

            const tTemp5 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp5);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp4, arg2: tPosition, result: "t"+tTemp5});

            if (this.type.name == "STRING") {
                // const tTemp4 = environment.addT();
                // environment.handlerQuartet.listTempsInt.push(tTemp4);
                // // Tiene que ir a buscar el valor del string en la pila de strings
                // // Obtenemos la posicion en el stackS
                // environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                // environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
            } else if (this.type.name == "FLOAT") {
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp5});
            } else if (this.type.name == "CHAR") {
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp5});
            } else if (this.type.name == "INTEGER") {
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp5});
            } else {
                //Si es un valor de tipo objeto y no primitivo
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp5});
            }

        } else {
            let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());
            if (symbol == null) {
                symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
            }
            const tPosition = this.generatePosAsignDim(environment, symbol.listDimsTemps);

            if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del "+this.id, arg2: null, result: null});

                const tTemp = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp);
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

                const tTemp2 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});

                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});
                const tTemp3 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp3);
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp2, arg2: tPosition, result: "t"+tTemp3});

                if (this.asignation.type.name == "FLOAT") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                } 
                
                if (this.type.name == "STRING") {
                    const tTemp4 = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    // Tiene que ir a buscar el valor del string en la pila de strings
                    // Obtenemos la posicion en el stackS
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
                } else if (this.type.name == "FLOAT") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                } else if (this.type.name == "CHAR") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                } else if (this.type.name == "INTEGER") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                } else {
                    //Si es un valor de tipo objeto y no primitivo
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                }


            } else {
                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el This", arg2: null, result: null});

                const tTemp = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp);
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTemp});
                
                const tTemp2 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
                
                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});
                const tTemp3 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp3);
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp2, arg2: symbol.direction, result: "t"+tTemp3});

                const tTemp4 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp4);
                environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});

                const tTemp5 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp5);
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp4, arg2: tPosition, result: "t"+tTemp5});

                

                if (this.type.name == "STRING") {
                    // const tTemp4 = environment.addT();
                    // environment.handlerQuartet.listTempsInt.push(tTemp4);
                    // // Tiene que ir a buscar el valor del string en la pila de strings
                    // // Obtenemos la posicion en el stackS
                    // environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    // environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
                } else if (this.type.name == "FLOAT") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp5});
                } else if (this.type.name == "CHAR") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp5});
                } else if (this.type.name == "INTEGER") {
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp5});
                } else {
                    //Si es un valor de tipo objeto y no primitivo
                    environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp5});
                }

            }
        }
    }
}
