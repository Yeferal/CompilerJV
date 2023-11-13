import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";

export class AsigAtribObject extends Node {

    private _idObj: string;
    private _idAtrib: string;
    private _asignation: Node;
    private _isThis: boolean;
    private _isArray: boolean;


	constructor(positionToken: PositionToken, token: string, idObj: string, idAtrib: string, asignation: Node, isThis: boolean, isArray: boolean) {
		super(positionToken, null, token);
        this._idObj = idObj;
		this._idAtrib = idAtrib;
		this._asignation = asignation;
		this._isThis = isThis;
		this._isArray = isArray;
	}

    /**
     * Getter idObj
     * @return {string}
     */
	public get idObj(): string {
		return this._idObj;
	}

    /**
     * Getter idAtrib
     * @return {string}
     */
	public get idAtrib(): string {
		return this._idAtrib;
	}

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Getter isThis
     * @return {boolean}
     */
	public get isThis(): boolean {
		return this._isThis;
	}

    /**
     * Getter isArray
     * @return {boolean}
     */
	public get isArray(): boolean {
		return this._isArray;
	}

    /**
     * Setter idObj
     * @param {string} value
     */
	public set idObj(value: string) {
		this._idObj = value;
	}

    /**
     * Setter idAtrib
     * @param {string} value
     */
	public set idAtrib(value: string) {
		this._idAtrib = value;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
	}

    /**
     * Setter isThis
     * @param {boolean} value
     */
	public set isThis(value: boolean) {
		this._isThis = value;
	}

    /**
     * Setter isArray
     * @param {boolean} value
     */
	public set isArray(value: boolean) {
		this._isArray = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //buscar el objeto en la tabla de tipos por ambitos
        //is es this entonces que lo busque como un atributo
        let symbolObj = null;
        if (this.isThis) {
            symbolObj = handlerComprobation.searchSymbolThis(this.idObj);
            
        } else {
            symbolObj = handlerComprobation.searchSymbol(this.idObj);
        }

        if (symbolObj == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `No existe una variable con el nombre << ${this.idObj} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        // if (this.isArray && (symbolObj.isArray==null || !symbolObj.isArray)) {
        //     const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo << ${this.idObj} >> no es un arreglo.`, ErrorType.SEMANTIC); 
        //     handlerComprobation.listError.push(errorGramm);
        //     return ;
        // }
        
        

        //buscar el atributo en la tabla de tipos general
        const symbolAtrib = handlerComprobation.searchSymbolAtribClass(this.idAtrib, symbolObj.type.name);

        if (symbolAtrib == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `No existe el atribuyo con el nombre << ${this.idAtrib} >> dentro de la clase ${symbolObj.type.name}.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isArray && (symbolAtrib==null || !symbolAtrib.isArray)) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (symbolAtrib.isConst) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo atributo << ${this.idAtrib} >> es de tipo final, no puede ser modificado.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        this.type = symbolAtrib.type;

        const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        
        
        if (resAsig == null) {
            console.log(resAsig);
            
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.type.name != resAsig.name) {
            console.log(this.type.name, "!=", resAsig.name);
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        

        if (this.isArray) {

            if (this.asignation instanceof DataArray) {
                return this.type;
            } else if (this.asignation instanceof InstanceArray) {
                return this.type;
            } else if (this.asignation instanceof Identifier) {
                const identifier = this.asignation as Identifier;
                const symbolId = handlerComprobation.searchSymbol(identifier.id);
                console.log("Simbolo arreglo: ", symbolId);
                
                if (symbolId.isArray == null || !symbolId.isArray) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
            } else {
                const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        } else {
            
            
            if (this.asignation instanceof DataArray) {
                const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            } else if (this.asignation instanceof InstanceArray) {
                
                const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            } else if (this.asignation instanceof Identifier) {
                const identifier = this.asignation as Identifier;
                const symbolId = handlerComprobation.searchSymbol(identifier.id);
                if (symbolId.isArray != null && symbolId.isArray) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.idAtrib, `El symbolo atributo << ${this.idAtrib} >> no es un arreglo por lo que la asignacion no es posbile.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
            }
        }

        return ;
    }

    public override executeComprobationControlFlow(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override executeComprobationAccess(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override executeComprobation(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override execute(environment: Environment): any {

        const tAsig = this.asignation.execute(environment);

        let symbolAmbit;
        if (environment.isClass) {
            symbolAmbit = environment.symbolTable.searchSymbolFuncProc(environment.voidNow.peek(), environment.acutalClass.name); 
        } else {
            symbolAmbit = environment.symbolTable.searchSymbolMain(environment.ambitNow.peek());
        }

        let symbolObj;
        if (environment.isClass) {
            if (this.isThis) {
                symbolObj = environment.symbolTable.searchSymbolAtribClass(this.idObj, environment.acutalClass.name);
                // symbolObj= environment.symbolTable.searchSymbolAtribClass(this.idObj, environment.ambitNow.peek());
            } else {
                symbolObj = environment.symbolTable.searchSymbolVar(this.idObj, environment.ambitNow.peek());
                if (symbolObj == null) {
                    symbolObj = environment.symbolTable.searchSymbolAtribClass(this.idObj, environment.acutalClass.name);
                }
            }
        } else {
            symbolObj = environment.symbolTable.searchSymbolVar(this.idObj, environment.ambitNow.peek());
        }

        // let symbolAtrib = environment.symbolTable.searchSymbolVar(this.id, symbolObj.type.name);
        let symbolAtrib = environment.symbolTable.searchSymbolAtribClass(this.idAtrib, symbolObj.type.name);
        if (symbolAtrib == null) {
            symbolAtrib = environment.symbolTable.searchSymbolAtribClass(this.idAtrib, symbolObj.type.name);
        }

        const nodeId = new Identifier(this.positionToken, this.idObj, this.idObj, this.isThis);
        nodeId.type = this.type;
        const tTemp = nodeId.execute(environment);

        //Preparar el heap para el this
        const tTemp2 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp2);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp2});
        const tTemp3 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp3);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTemp3});

        environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tTemp, arg2: null, result: "t"+tTemp3});

        //Mover el puntero temporalmente
        const tTemp4 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp4);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp4});
        const tTemp5 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp5);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTemp5});

        environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp5, arg2: null, result: tTemp});

        //Obteniedno la posicion del heap del atributo
        const tTemp6 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp6);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: tTemp, arg2: symbolAtrib.direction, result: "t"+tTemp6});

        //obteniendo el valor del heap
        // const tTemp7 = environment.addT();
        // environment.handlerQuartet.listTempsInt.push(tTemp7);
        environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp6});

        // return "t"+tTemp7;
    }
}
