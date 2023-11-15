import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";

export class CallArray extends Node {
    private _id: string;
    private _dimensions: Array<Node>;
    private _isThis: boolean;

	constructor(positionToken: PositionToken, token: string, id: string, dimensions: Array<Node>, isThis: boolean) {
		super(positionToken, null, token);
        this._id = id;
		this._dimensions = dimensions;
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
        //Busca el simbolo si existe
        const symbolArray = handlerComprobation.searchSymbol(this.id);

        if (symbolArray == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `No existe una variable con el nombre << ${this.id} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        
        if (symbolArray.isArray==null || !symbolArray.isArray) {
            //Error no es un arreglo
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El simbolo << ${this.id} >> no es un arreglo.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return this.type;
        }

        //Verifica el numero de dims osea [] [] [] que conicida con el # de dims de la llamada
        if (symbolArray.numDims != this.dimensions.length) {
            //Error
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `el numero de parametros de las dimensiones no coincide en el arreglo << ${this.id} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
        }

        //Verifica que los dims sean enteros
        for (let i = 0; i < this.dimensions.length; i++) {
            const resType = this.dimensions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            // console.log(resType);
            
            if (resType.name != "INTEGER") {
                //Error no es un entero
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `El valor de la dimension no es un entero en el arreglo << ${this.id} >>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
            }
        }

        this.type = symbolArray.type;

        //Verica que no sobrepase el tamanio del arreglo, esto se hara si da tiempo, Esta YUCA!!! xD
        //En la declaracion de arreglo, se puede contar el tamanio por el numero de elementos en la asignacion el numero de valores que tiene
        
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

            const tTempReturn = environment.addT();
            environment.handlerQuartet.listTempsFloat.push(tTempReturn);
            environment.handlerQuartet.insertQuartet({operator: "heap_declar_f", arg1: "t"+tTemp5, arg2: null, result: "t"+tTempReturn});

            return "t"+tTempReturn;

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

                const tTempReturn = environment.addT();
                environment.handlerQuartet.listTempsFloat.push(tTempReturn);
                environment.handlerQuartet.insertQuartet({operator: "heap_declar_f", arg1: "t"+tTemp3, arg2: null, result: "t"+tTempReturn});

                return "t"+tTempReturn;

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

                const tTempReturn = environment.addT();
                environment.handlerQuartet.listTempsFloat.push(tTempReturn);
                environment.handlerQuartet.insertQuartet({operator: "heap_declar_f", arg1: "t"+tTemp5, arg2: null, result: "t"+tTempReturn});

                return "t"+tTempReturn;
            }
        }
        
    }
}
