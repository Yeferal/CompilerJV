import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { LogicalOperation } from "../expressions/logical-operation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
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
        // if (symbol.isArray==null || !symbol.isArray) {
        //     const errorGramm = new ErrorGramm(this.positionToken, this.id, `El symbolo << ${this.id} >> no es un arreglo.`, ErrorType.SEMANTIC); 
        //     handlerComprobation.listError.push(errorGramm);
        //     return ;
        // }

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
                        return ;
                    } else{
                        if (symbol.numDims != symbolIdentifier.numDims) {
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de dimensiones validas para el arreglo son distintas del numero de la asignacion.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                        }
                    }
                    
                    return ;
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

    private asigDimsArray(symbol: Symbol){
        if (symbol.isArray) {
            if (this.asignation instanceof Identifier) {
                const identifier = this.asignation as Identifier;
                symbol.listDimsTemps = identifier.dimsT;
            } if (this.asignation instanceof DataArray) {
                const dataArray = this.asignation as DataArray;
                symbol.listDimsTemps = dataArray.dimsT;
            } if (this.asignation instanceof InstanceArray) {
                const instanceArray = this.asignation as InstanceArray;
                symbol.listDimsTemps = instanceArray.dimsT;
            }
        }
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

        if (environment.isClass) {
            if (this.isThis) {
                const symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
                this.asigDimsArray(symbol);

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
                let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());
                if (symbol == null) {
                    symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
                }
                this.asigDimsArray(symbol);

                if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                    environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del "+this.id, arg2: null, result: null});

                    const tTemp = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

                    if (this.type.name == "STRING") {
                    
                        const tTemp4 = environment.addT();
                        environment.handlerQuartet.listTempsInt.push(tTemp4);
                        // Tiene que ir a buscar el valor del string en la pila de strings
                        // Obtenemos la posicion en el stackS
                        environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp4});

                        environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
                    } else if (this.type.name == "FLOAT") {
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
                    } else if (this.type.name == "CHAR" || this.type.name == "INTEGER") {
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp});
                    }else {
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp});
                    }

                } else {

                    environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el This", arg2: null, result: null});

                    const tTemp = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTemp});
                    
                    const tTemp2 = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp2);
                    environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
                    
                    environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del "+this.id, arg2: null, result: null});
                    const tTemp3 = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp3);
                    environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp2, arg2: symbol.direction, result: "t"+tTemp3});

                    if (this.type.name == "STRING") {
                    
                        const tTemp4 = environment.addT();
                        environment.handlerQuartet.listTempsInt.push(tTemp4);
                        // Tiene que ir a buscar el valor del string en la pila de strings
                        // Obtenemos la posicion en el stackS
                        environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});

                        environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
                    } else if (this.type.name == "FLOAT") {
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    } else if (this.type.name == "CHAR" || this.type.name == "INTEGER") {
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    }else {
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    } 
                }

            }
        } else {
            let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());

            this.asigDimsArray(symbol);
            // if (symbol == null) {
            //     symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
            // }

            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});
            
            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

            if (this.type.name == "STRING") {

                const tTemp2 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                // Tiene que ir a buscar el valor del string en la pila de strings
                // Obtenemos la posicion en el stackS
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
                environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp2});
            } else if (this.type.name == "FLOAT") {
                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else if (this.type.name == "CHAR") {
                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else if (this.type.name == "INTEGER") {
                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else if (this.type.name == "BOOLEAN") {
                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else {
                //Si es un valor de tipo objeto y no primitivo
                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            }
        }
    }
}
