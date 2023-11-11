import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";

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
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            handlerComprobation.getAmbitS(),                                //nameCode
            this.id,                                //name
            SymbolType.CONSTRUCTOR,                 //symbolType
            false,                        //isFunction
            this.type,                              //type, tipo de dato
            this.listParams.length,                 //numParams
            listTypeParams,                         //listParams
            null, //direccion o el numero de puntero para la pila de ejecucion
            handlerComprobation.sizeFuncProc,       //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                                  //isReference
            EncapsulationType.PUBLIC,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            false                                   //isConst
        );

        newSymbol.ambit = handlerComprobation.actualClass.name;

        handlerComprobation.addSymbol(newSymbol);
        // console.log(newSymbol);
        
    }

    private addSymbolThis(handlerComprobation: HandlerComprobation){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            null,                                //nameCode
            "this",                                //name
            SymbolType.KEY_WORD,                 //symbolType
            false,                        //isFunction
            null,                              //type, tipo de dato
            null,                 //numParams
            null,                         //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,       //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                                  //isReference
            EncapsulationType.PUBLIC,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            false                                   //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();

        handlerComprobation.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
        //agregar ambito
        handlerComprobation.addAmbitS(this.id);
        handlerComprobation.addAmbit();
        handlerComprobation.sizeFuncProc = 0;

        if (handlerComprobation.actualClass.name != this.id) {
            //El construtor no pertenece a la clase
            const errorGramm = new ErrorGramm(this.positionToken, this.id, `El constructor es incorrecto << ${this.id} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
        this.addSymbol(handlerComprobation, []);
        this.addSymbolThis(handlerComprobation);

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
        handlerComprobation.setListParamsTableSymbol(this.id, handlerComprobation.actualClass.name, listTypeParams);
        handlerComprobation.setListSizeTableSymbol(this.id, handlerComprobation.actualClass.name, this.size);

        //sacar el ambito
        handlerComprobation.popAmbitS();
        handlerComprobation.popAmbit();
        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();

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

    public generatePrincipalQuartet(environment: Environment){
        let symbolConstructor = environment.searchSymbolConstructor(this.id);
        // tm1 = h
        const nT1 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(nT1);
        environment.handlerQuartet.insertQuartet({operator: "=", arg1: "h", arg2: null, result: "t"+nT1});
        // h = h + 2
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "h", arg2: symbolConstructor.size, result: "h"});
        // tm2 = ptr + 0
        const nT2 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(nT2);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+nT2});
        // stack[tm2] = tm1
        environment.handlerQuartet.insertQuartet({operator: "stack", arg1: "t"+nT1, arg2: null, result: "t"+nT2});

    }

    public override execute(environment: Environment): any {
        environment.handlerQuartet.insertQuartet({operator: "constructor", arg1: this.id, arg2: this.id, result: null});
        this.generatePrincipalQuartet(environment);

        //Obtener Parametros
        for (let i = 0; i < this.listParams.length; i++) {
            this.listParams[i].execute(environment);
            
        }

        //Ejecutar las instrucciones
        for (let i = 0; i < this.instructions.length; i++) {
            // const element = array[i];
            
        }

        environment.handlerQuartet.insertQuartet({operator: "close", arg1: null, arg2: null, result: null});
        //Guardar heap
        //Apartar heap
        //Apartar heap
        // throw new Error("Method not implemented.");
    }
}
