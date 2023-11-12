import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";

export class InputNode extends Node {
    private _id: string;
    public nodeId: Identifier;

	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, id: string) {
        super(positionToken, type, toke);
        this._id = id;
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


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        // const symbol = handlerComprobation.searchSymbol(this.id);
        // if (symbol == null) {
        //     //si no existe crea un error y lo agrega a la lista de errores
        //     const errorGramm = new ErrorGramm(this.positionToken, this.id, `No existe una variable con el nombre << ${this.id} >> dentro del ambito.`, ErrorType.SEMANTIC); 
        //     handlerComprobation.listError.push(errorGramm);
        //     return ;
        // }

        this.nodeId = new Identifier(this.positionToken, this.id, this.id, false);
        const resType = this.nodeId.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        
        
        if (resType==null || this.type.name != resType.name) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << input${this.type.name} => ${this.id} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato del input.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
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
        
        const tTempInp = environment.addT();
        switch(this.type.name){
            case "FLOAT":
                environment.handlerQuartet.listTempsFloat.push(tTempInp);
                environment.handlerQuartet.insertQuartet({operator: "scanf", arg1: "%f", arg2: null, result: "t"+tTempInp});
                break;
            case "INTEGER":
                environment.handlerQuartet.listTempsInt.push(tTempInp);
                environment.handlerQuartet.insertQuartet({operator: "scanf", arg1: "%d", arg2: null, result: "t"+tTempInp});
                environment.handlerQuartet.insertQuartet({operator: "clear_buf", arg1: null, arg2: null, result: null});
                break;
            case "CHAR":
                environment.handlerQuartet.listTempsInt.push(tTempInp);
                environment.handlerQuartet.insertQuartet({operator: "scanf", arg1: "%d", arg2: null, result: "t"+tTempInp});
                break;
            case "BOOLEAN":
                environment.handlerQuartet.listTempsInt.push(tTempInp);
                environment.handlerQuartet.insertQuartet({operator: "scanf", arg1: "%d", arg2: null, result: "t"+tTempInp});
                break;
            case "STRING":
                environment.handlerQuartet.listTempsString.push(tTempInp);
                environment.handlerQuartet.insertQuartet({operator: "scanf", arg1: "%49s", arg2: null, result: "t"+tTempInp});
                break;
        }
        const tAsig = "t"+tTempInp;
        
        if (environment.isClass) {
            let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());
                if (symbol == null) {
                    symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
                }

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
                    if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                        environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    } else {
                        environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    }
                    environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
                } else if (this.type.name == "FLOAT") {
                    if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    } else {
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                        
                    }
                } else if (this.type.name == "CHAR") {
                    if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    } else {
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                        
                    }
                } else if (this.type.name == "INTEGER") {
                    if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    } else {
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                        
                    }
                } else {
                    if (symbol.symbolType == SymbolType.PARAM || symbol.symbolType == SymbolType.VAR) {
                        //Si es un valor de tipo objeto y no primitivo
                        environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    } else {
                        //Si es un valor de tipo objeto y no primitivo
                        environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
                    }
                }
        } else {
            let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());

            // if (symbol == null) {
            //     symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
            // }

            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});
            
            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

            if (this.type.name == "STRING") {
                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                // // Tiene que ir a buscar el valor del string en la pila de strings
                // const tTemp3 = environment.addT();
                // environment.handlerQuartet.listTempsString.push(tTemp3);
                // environment.handlerQuartet.insertQuartet({operator: "stack_string_declar", arg1: "t"+tTemp2, arg2: null, result: "t"+tTemp3});
                // return "t"+tTemp3;

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
        // const tTemp2 = this.nodeId.execute(environment);
    }
}
