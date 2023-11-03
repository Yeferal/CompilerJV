import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";

export class CallArray extends Node {
    private _id: string;
    private _dimensions: Array<Node>;


	constructor(positionToken: PositionToken, token: string, id: string, dimensions: Array<Node>) {
		super(positionToken, null, token);
        this._id = id;
		this._dimensions = dimensions;
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
            if (resType != handlerComprobation.typeTable.getDataType("INTEGER")) {
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

    public override execute(environment: Environment): any {
        throw new Error("Method not implemented.");
    }
}
