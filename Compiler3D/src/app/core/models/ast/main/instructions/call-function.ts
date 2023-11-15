import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { FunctionProcedure } from "./function-procedure";

export class CallFunction extends Node {
    private _id: string;
    private _params: Array<Node>;
    private _isThis: boolean;

	constructor(positionToken: PositionToken, token: string, id: string, params: Array<Node>, isThis: boolean) {
        super(positionToken, null, token);
		this._id = id;
		this._params = params;
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

        //buscar la funciones para comprobar si existe
        let symbolFunc = handlerComprobation.searchSymbolThis(this.id);
        
        if (symbolFunc == null) {
            if (handlerComprobation.actualClass==null) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe una funcion o procedimiento << ${this.id} >>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return this.type;
            }
            // buscar en las funciones del nodo class actual 
            let classAc = handlerComprobation.actualClass;
            for (let i = 0; i < classAc.instructions.length; i++) {
                if (classAc.instructions[i] instanceof FunctionProcedure) {
                    const funProcTemp = classAc.instructions[i] as FunctionProcedure;
                    if (funProcTemp.id == this.id) {
                        let listTypeParams: Array<DynamicDataType> = new Array<DynamicDataType>;
                        //Verificar que los parametros sean correctos
                        for (let j = 0; j < funProcTemp.listParams.length; j++) {
                            listTypeParams.push(funProcTemp.listParams[j].type);
                        }

                        symbolFunc = new Symbol(
                            0,     //id
                            null,                                //nameCode
                            funProcTemp.id,                                //name
                            funProcTemp.isFunction? SymbolType.FUNCTION : SymbolType.PROCEDURE,//symbolType
                            funProcTemp.isFunction,                        //isFunction
                            funProcTemp.type,                              //type, tipo de dato
                            funProcTemp.listParams.length,                 //numParams
                            listTypeParams,                         //listParams
                            null, //direccion o el numero de puntero para la pila de ejecucion
                            handlerComprobation.sizeFuncProc,       //Tamanio del symbol
                            false,                                  //isArray
                            null,                                   //listDims
                            false,                                  //isReference
                            null,                     //encapsulationType
                            null,//fullname, desde que paquete hasta el id
                            false                                   //isConst
                        );

                        this.type = funProcTemp.type;
                    }
                }
            }
            if (symbolFunc == null) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe una funcion o procedimiento << ${this.id} >>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return this.type;
            }
        } else {
            this.type = symbolFunc.type;
        }

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
                    if (listParamsOfNode[i].name != paramSymbol[i].name) {
                        //Error no son del mismo tipo
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros no coincide en la funcion << ${this.token} >>.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                    }
                }
            }
        }

        if (!symbolFunc.isFunction) {
            this.type = null;
        }

        return this.type;
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

        let symbolAmbit = environment.symbolTable.searchSymbolFuncProc(environment.voidNow.peek(), environment.acutalClass.name);
        
        
        // const symbolFuncParent = environment.symbolTable.searchSymbolFuncProc(environment.voidNow.peek(), environment.acutalClass.name);
        
        const symbolFunc = environment.symbolTable.searchSymbolFuncProc(this.id, environment.acutalClass.name);
        // console.log(symbolAmbit);
        // console.log(symbolFunc);

        // const tTemp = nodeId.execute(environment);
        
        //Obteniendo el this
        const tTempThis = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTempThis);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+tTempThis});

        const tTemp = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp);
        environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTempThis, arg2: null, result: "t"+tTemp});

        //Preparar el heap para el this
        const tTemp2 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp2);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp2});
        const tTemp3 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp3);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp2, arg2: "0", result: "t"+tTemp3});

        environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp3});
        

        //Preparar parametros si los hay
        if (this.params!= null && this.params.length>0) {
            for (let i = 0; i < this.params.length; i++) {
                const tAsig = this.params[i].execute(environment);

                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "PREPARANDO EL PARAMETRO PARA EL "+this.id, arg2: null, result: null});
                const tTemp = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp)
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp});

                const tTemp2 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp2)
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp, arg2: i+1, result: "t"+tTemp2});
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: i+1, result: "t"+tTemp2});
                
            }
        }

        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "ptr"});
        environment.handlerQuartet.insertQuartet({operator: "call_func", arg1: symbolFunc.nameCode+this.genSubName(symbolFunc), arg2: null, result: null});
        environment.handlerQuartet.insertQuartet({operator: "-", arg1: "ptr", arg2: symbolAmbit.size, result: "ptr"});

        
        if (symbolFunc.isFunction) {
            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del return", arg2: null, result: null});
    
                
            //Mover el puntero temporalmente
            const tTemp6 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp6);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp6});
    
            const symbolReturn = environment.symbolTable.searchSymbolReturn(symbolFunc.nameCode)
            // console.log(symbolReturn);
            //Obtener la direcciones del return
            const tTemp7 = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp7);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp6, arg2: symbolReturn.size, result: "t"+tTemp7});
    
            //Obtener el de valor del Return
            const tTemp8 = environment.addT();
            
            
            

            if (symbolReturn.type.name == "STRING") {
                
            } else if (this.type.name == "FLOAT") {
                environment.handlerQuartet.listTempsFloat.push(tTemp8);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTemp7, arg2: null, result: "t"+tTemp8});
            } else if (this.type.name == "INTEGER") {
                environment.handlerQuartet.listTempsInt.push(tTemp8);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp7, arg2: null, result: "t"+tTemp8});
            } else if (this.type.name == "CHAR") {
                environment.handlerQuartet.listTempsInt.push(tTemp8);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp7, arg2: null, result: "t"+tTemp8});
            } else if (this.type.name == "BOOLEAN") {
                environment.handlerQuartet.listTempsInt.push(tTemp8);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp7, arg2: null, result: "t"+tTemp8});
            } else {
                // environment.handlerQuartet.listTempsFloat.push(tTemp8);
                // environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTemp7, arg2: null, result: "t"+tTemp8});
            }
            
    
            return "t"+tTemp8;
        }
    }
}
