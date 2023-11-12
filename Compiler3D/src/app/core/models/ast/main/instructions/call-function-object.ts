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

export class CallFunctionObject extends Node {
    private _idObj: string;
    private _id: string;
    private _params: Array<Node>;
    private _isThis: boolean;

	constructor(positionToken: PositionToken, token: string, idObj: string, id: string, params: Array<Node>, isThis: boolean) {
        super(positionToken, null, token);
		this._idObj = idObj;
        this._id = id;
		this._params = params;
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
     * Setter idObj
     * @param {string} value
     */
	public set idObj(value: string) {
		this._idObj = value;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter params
     * @return {Array<Node>}
     */
	public get params(): Array<Node> {
		return this._params;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter params
     * @param {Array<Node>} value
     */
	public set params(value: Array<Node>) {
		this._params = value;
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
        const typesCorrect = [SymbolType.FUNCTION, SymbolType.PROCEDURE, SymbolType.VOID];
        return typesCorrect.includes(typeAsig);
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

        //buscar la funciones para comprobar si existe
        const symbolFunc = handlerComprobation.searchSymbolAtribClass(this.id, symbolObj.type.name);
        this.type = symbolFunc.type;

        //Verificar que sea una funcion o procedimiento
        if (!this.isTypeCorrect(symbolFunc.symbolType)) {
            //Erro no es una funcion o procedimiento
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe una funcion o procedimiento << ${this.id} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return this.type;
        }

        //Ejecutar las comprobaciones para obtener los tipos de datos de los parametros
        let listParamsOfNode = new Array<DynamicDataType>;
        for (let i = 0; i < this.params.length; i++) {
            listParamsOfNode.push(this.params[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation));
        }

        if (this.params.length != symbolFunc.listParams.length) {
            //Error el numero de parametros no coincide
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros no coincide en la funcion << ${this.token} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        } else {
            //Comprara que el tipo de dato de los parametros sea el mismo
            if (this.params.length > 0) {
                const paramSymbol = symbolFunc.listParams;
                for (let i = 0; i < listParamsOfNode.length; i++) {
                    if (listParamsOfNode[i] != paramSymbol[i]) {
                        //Error no son del mismo tipo
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros no coincide en la funcion << ${this.token} >>.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                        return ;
                    }
                }
            }
        }

        if (!symbolFunc.isFunction) {
            this.type = null;
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

    public genSubName(symbol: Symbol): string{
        let text = "_"+this.type.name;
        if (symbol.listParams == null) {
            return text;
        }
        for (let i = 0; i < symbol.listParams.length; i++) {
            text += "_"+symbol.listParams[i].name
            
        }
        return text;
    }

    public override execute(environment: Environment): any {
        

        let symbolFuncParent;
        if (environment.isClass) {
            symbolFuncParent = environment.symbolTable.searchSymbolFuncProc(environment.voidNow.peek(), environment.acutalClass.name); 
        } else {
            symbolFuncParent = environment.symbolTable.searchSymbolMain(environment.ambitNow.peek());
        }
        
        
        let symbolFunc = environment.symbolTable.searchSymbolVar(this.idObj, environment.ambitNow.peek());
        if (symbolFunc == null) {
            symbolFunc = environment.symbolTable.searchSymbolAtribClass(this.idObj, environment.ambitNow.peek());
        }
        // console.log(symbolFunc);
        

        const nodeId = new Identifier(this.positionToken, this.idObj, this.idObj, this.isThis);
        nodeId.type = this.type;
        const tTemp = nodeId.execute(environment);
        //Preparar el heap para el this
        const tTemp2 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp2);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: environment.sizeMain, result: "t"+tTemp2});
        const tTemp3 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp3);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTemp3});

        environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tTemp, arg2: null, result: "t"+tTemp3});



        //Ahora Preparar los parametros y llamar a la funcion
        if (this.params!= null && this.params.length>0) {
            //Preparar los parametros
            for (let i = 0; i < this.params.length; i++) {
                const tAsig = this.params[i].execute(environment);

                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "PREPARANDO EL PARAMETRO PARA "+this.id, arg2: null, result: null});
                const tTemp4 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp4)
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: environment.sizeMain, result: "t"+tTemp4});

                const tTemp5 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp5)
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp, arg2: i+1+"", result: "t"+tTemp5});
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: i+1+"", result: "t"+tTemp5});
                
            }
        }

        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolFuncParent.size, result: "ptr"});
        environment.handlerQuartet.insertQuartet({operator: "call_func", arg1: symbolFunc.type.name+"_"+this.id+this.genSubName(symbolFunc), arg2: null, result: null});
        environment.handlerQuartet.insertQuartet({operator: "-", arg1: "ptr", arg2: symbolFuncParent.size, result: "ptr"});

        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del return", arg2: null, result: null});


        //Mover el puntero temporalmente
        const tTemp6 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp6);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolFuncParent.size, result: "t"+tTemp6});

        //Obtener la direcciones del return
        const tTemp7 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp7);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp6, arg2: symbolFunc.size, result: "t"+tTemp7});

        //Obtener el de valor del Return
        const tTemp8 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp8);
        environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTemp7, arg2: null, result: "t"+tTemp8});

        return "t"+tTemp8;

    }
}
