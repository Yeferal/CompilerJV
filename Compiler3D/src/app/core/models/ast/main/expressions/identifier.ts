import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";

export class Identifier extends Node{
    private _id: string;
    private _value: any;
    private _isThis: boolean;

    constructor(positionToken: PositionToken, toke: string, id: any, isThis: boolean) {
        super(positionToken, null, toke);
		this._id = id;
        this._isThis = isThis;
	}

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
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


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Busca la variable en la tabla se simbolos
        //comprobacion de ambito y nombre
        let symbol = null;
        if (this.isThis) {
            symbol = handlerComprobation.searchSymbolAtribClass(this.id, handlerComprobation.actualClass.name);
        } else {
            symbol = handlerComprobation.searchSymbol(this.id);
        }
        
        //si existe la variable, retorna el tipo de dato de la variable
        // console.log(symbol);
        
        if (symbol != null) {
            this.type = symbol.type;
            return symbol.type;
        }else {
            //si no existe crea un error y lo agrega a la lista de errores
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `No existe una variable con el nombre << ${this.id} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
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
        //DEBE TENER UN MECANISMO QUE USA EL HEAP PARA LA VARIBLE Y OTRO PARA CUANDO SE STACK (es decir cuando este la variable en el main)

        if (environment.isClass) {
            if (this.isThis) {
                const symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
                console.log(symbol);

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

                const tTemp4 = environment.addT();
                if (this.type.name == "STRING") {
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    // Tiene que ir a buscar el valor del string en la pila de strings
                    // Obtenemos la posicion en el stackS
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});

                    const tTemp5 = environment.addT();
                    environment.handlerQuartet.listTempsString.push(tTemp5);
                    environment.handlerQuartet.insertQuartet({operator: "stack_string_declar", arg1: "t"+tTemp4, arg2: null, result: "t"+tTemp5});
                    return "t"+tTemp5;
                } else if (this.type.name == "FLOAT") {
                    environment.handlerQuartet.listTempsFloat.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_f", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    return "t"+tTemp4;
                } else if (this.type.name == "CHAR") {
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    return "t"+tTemp4;
                } else if (this.type.name == "INTEGER") {
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    return "t"+tTemp4;
                } else {
                    //Si es un valor de tipo objeto y no primitivo
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    // Retorna su posicion en memoria del objeto
                    return "t"+tTemp4;
                }
            } else {
                let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow);

                if (symbol == null) {
                    symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
                }
                console.log(symbol);

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

                const tTemp4 = environment.addT();
                if (this.type.name == "STRING") {
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    // Tiene que ir a buscar el valor del string en la pila de strings
                    // Obtenemos la posicion en el stackS
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});

                    const tTemp5 = environment.addT();
                    environment.handlerQuartet.listTempsString.push(tTemp5);
                    environment.handlerQuartet.insertQuartet({operator: "stack_string_declar", arg1: "t"+tTemp4, arg2: null, result: "t"+tTemp5});
                    return "t"+tTemp5;
                } else if (this.type.name == "FLOAT") {
                    environment.handlerQuartet.listTempsFloat.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_f", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    return "t"+tTemp4;
                } else if (this.type.name == "CHAR") {
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    return "t"+tTemp4;
                } else if (this.type.name == "INTEGER") {
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    return "t"+tTemp4;
                } else {
                    //Si es un valor de tipo objeto y no primitivo
                    environment.handlerQuartet.listTempsInt.push(tTemp4);
                    environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                    // Retorna su posicion en memoria del objeto
                    return "t"+tTemp4;
                }
            }

        } else {
            let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow);

            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});

            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del "+this.id, arg2: null, result: null});
            const tTemp2 = environment.addT();
            if (this.type.name == "STRING") {
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                // Tiene que ir a buscar el valor del string en la pila de strings
                const tTemp3 = environment.addT();
                environment.handlerQuartet.listTempsString.push(tTemp3);
                environment.handlerQuartet.insertQuartet({operator: "stack_string_declar", arg1: "t"+tTemp2, arg2: null, result: "t"+tTemp3});
                return "t"+tTemp3;
            } else if (this.type.name == "FLOAT") {
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
            } else if (this.type.name == "CHAR") {
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
            } else if (this.type.name == "INTEGER") {
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
            } else {
                //Si es un valor de tipo objeto y no primitivo
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
            }
            return "t"+tTemp2;
        }
    }
}
