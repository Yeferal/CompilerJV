import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";

export class CallValueObject extends Node {
    private _idObj: string;
    private _id: string;
    private _isThis: boolean;

	constructor(positionToken: PositionToken, toke: string, idObj: string, id: string, isThis: boolean) {
        super(positionToken, null, toke);
        this._idObj = idObj;
        this._id = id;
        this._isThis = isThis;
	}

    /**
     * Getter idObj
     * @return {string}
     */
	public get idObj(): string {
		return this._idObj;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter isThis
     * @return {boolean}
     */
	public get isThis(): boolean {
		return this._isThis;
	}

    /**
     * Setter idObj
     * @param {string} value
     */
	public set idObj(value: string) {
		this._idObj = value;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter isThis
     * @param {boolean} value
     */
	public set isThis(value: boolean) {
		this._isThis = value;
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

        this.type = symbolObj.type;
        

        //buscar el atributo en la tabla de tipos general
        const symbolAtrib = handlerComprobation.searchSymbolAtribClass(this.id, symbolObj.type.name);

        if (symbolAtrib == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `No existe el atribuyo con el nombre << ${this.id} >> dentro de la clase ${symbolObj.type.name}.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (symbolAtrib.isConst) {
            const errorGramm = new ErrorGramm(this.positionToken, this.idObj, `El symbolo atributo << ${this.id} >> es de tipo final, no puede ser modificado.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
        return this.type;
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
        let symbolAtrib = environment.symbolTable.searchSymbolAtribClass(this.id, symbolObj.type.name);
        if (symbolAtrib == null) {
            symbolAtrib = environment.symbolTable.searchSymbolAtribClass(this.id, symbolObj.type.name);
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
        const tTemp7 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp7);
        environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp6, arg2: null, result: "t"+tTemp7});

        this.type = symbolAtrib.type;
        return "t"+tTemp7;
    }
}
