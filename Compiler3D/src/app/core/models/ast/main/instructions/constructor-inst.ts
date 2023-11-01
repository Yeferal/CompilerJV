import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { DynamicDataType } from "../utils/DynamicDataType";

export class ConstructorInst extends Node {
    private _id: string;
    private _listParams: Array<Node>;
    private _instructions: Array<Node>;
    private _encapsulation: string = "public"
    size: number = 0;

    constructor(positionToken: PositionToken, toke: string, id: string, listParams: Array<Node>, instructions: Array<Node>) {
		super(positionToken, null, toke);
		this._id = id;
        this._listParams = listParams;
		this._instructions = instructions;
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
     * Getter listParams
     * @return {Array<Node>}
     */
	public get listParams(): Array<Node> {
		return this._listParams;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Getter encapsulation
     * @return {string }
     */
	public get encapsulation(): string  {
		return this._encapsulation;
	}

    /**
     * Setter listParams
     * @param {Array<Node>} value
     */
	public set listParams(value: Array<Node>) {
		this._listParams = value;
	}

    /**
     * Setter instructions
     * @param {Array<Node>} value
     */
	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}

    /**
     * Setter encapsulation
     * @param {string } value
     */
	public set encapsulation(value: string ) {
		this._encapsulation = value;
	}

    public addSymbol(handlerComprobation: HandlerComprobation, listTypeParams: Array<DynamicDataType>){
        // const newSymbol: Symbol = new Symbol(
        //     handlerComprobation.getIdDynamic(),     //id
        //     this.id,                                //nameCode
        //     this.id,                                //name
        //     this.isFunction? SymbolType.FUNCTION : SymbolType.PROCEDURE,//symbolType
        //     this.isFunction,                        //isFunction
        //     this.type,                              //type, tipo de dato
        //     this.listParams.length,                 //numParams
        //     listTypeParams,                         //listParams
        //     handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
        //     handlerComprobation.sizeFuncProc,       //Tamanio del symbol
        //     false,                                  //isArray
        //     null,                                   //listDims
        //     false,                                  //isReference
        //     this.encapsulation,                     //encapsulation
        //     handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
        //     false                                   //isConst
        // );

        // newSymbol.ambit = handlerComprobation.getAmbitS();

        // handlerComprobation.addSymbol(newSymbol);
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
        //agregar ambito
        handlerComprobation.addAmbit();
        handlerComprobation.sizeFuncProc = 0;

        let listTypeParams: Array<DynamicDataType> = new Array<DynamicDataType>;
        //Verificar que los parametros sean correctos
        for (let j = 0; j < this.listParams.length; j++) {
            const resParam = this.listParams[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            listTypeParams.push(resParam);
        }

        //ejecutar las comprobaciones de las instrucciones
        for (let i = 0; i < this.instructions.length; i++) {
            this.instructions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        }

        //agregar el simbolo
        this.size = handlerComprobation.sizeFuncProc;
        this.addSymbol(handlerComprobation, listTypeParams);

        //sacar el ambito
        handlerComprobation.popAmbit();
        handlerComprobation.sizeFuncProc = 0;

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
        throw new Error("Method not implemented.");
    }
}
