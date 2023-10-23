import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { DeclarationArray } from "./declaration-array";
import { DeclarationParam } from "./declaration-param";
import { DeclarationVar } from "./declaration-var";
import { ListDeclaration } from "./list-declaration";

export class FunctionProcedure extends Node {
    private _isFunction: boolean; //Si es false, entonces es un procedimiento
    private _id: string;
    private _listParams: Array<Node>;
    private _instructions: Array<Node>;
    private _encapsulation: string = "public"
    size: number = 0;

	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, isFunction: boolean, id: string, listParams: Array<Node>, instructions: Array<Node>) {
		super(positionToken, type, toke);
        this._isFunction = isFunction;
		this._id = id;
		this._listParams = listParams;
		this._instructions = instructions;
	}
    

    /**
     * Getter isFunction
     * @return {boolean}
     */
	public get isFunction(): boolean {
		return this._isFunction;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
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
     * Setter isFunction
     * @param {boolean} value
     */
	public set isFunction(value: boolean) {
		this._isFunction = value;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
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
     * Getter encapsulation
     * @return {string }
     */
	public get encapsulation(): string  {
		return this._encapsulation;
	}

    /**
     * Setter encapsulation
     * @param {string } value
     */
	public set encapsulation(value: string ) {
		this._encapsulation = value;
	}

    public isTypeCorrect(typeAsig: SymbolType): boolean{
        const typesCorrect = [SymbolType.FUNCTION, SymbolType.PROCEDURE, SymbolType.VOID];
        return typesCorrect.includes(typeAsig);
    }

    public isTypeCorrectParam(typeAsig: DynamicDataType): boolean{
        const typesCorrect = [
            new DynamicDataType(1,"FLOAT", 1),
            new DynamicDataType(2,"INTEGER", 1),
            new DynamicDataType(3,"CHAR", 1),
            new DynamicDataType(4,"STRING", 1),
            new DynamicDataType(5,"BOOLEAN", 1),
        ];
        return typesCorrect.includes(typeAsig);
    }

    public addSymbol(handlerComprobation: HandlerComprobation, listTypeParams: Array<DynamicDataType>){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            this.id,                                //nameCode
            this.id,                                //name
            this.isFunction? SymbolType.FUNCTION : SymbolType.PROCEDURE,//symbolType
            this.isFunction,                        //isFunction
            this.type,                              //type, tipo de dato
            this.listParams.length,                 //numParams
            listTypeParams,                         //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            handlerComprobation.sizeFuncProc,       //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                                  //isReference
            null,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            false                                   //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();

        handlerComprobation.symbolTable.addSymbol(newSymbol);
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Buscar que no exista otro simbolo con ese nombre
        const symbolFunc = handlerComprobation.symbolTable.searchSymbol(this.id);
        if (symbolFunc) {
            //Error ya existe alguna simbolo con ese nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `Ya existe una simbolo con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return this.type;
        }

        //agregar ambito
        handlerComprobation.addAmbit();
        handlerComprobation.sizeFuncProc = 0;

        let listTypeParams: Array<DynamicDataType> = new Array<DynamicDataType>;
        //Verificar que los parametros sean correctos
        for (let j = 0; j < this.listParams.length; j++) {
            const resParam = this.listParams[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (!this.isTypeCorrectParam(resParam)) {
                //Error tipo de dato no admitido
                const errorGramm = new ErrorGramm(this.positionToken, this.toke, `El tipo de dato del parametro no es correcto.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return this.type;
            }
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
