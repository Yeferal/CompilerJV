import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { ReturnNode } from "../sentences/return-node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";

export class FunctionProcedure extends Node {
    private _isStatic: boolean;
    private _isFunction: boolean; //Si es false, entonces es un procedimiento
    private _id: string;
    private _listParams: Array<Node>;
    private _instructions: Array<Node>;
    private _encapsulationType: EncapsulationType;
    private _isOverride: boolean = false;
    size: number = 0;

	constructor(positionToken: PositionToken, type: DynamicDataType, token: string, isStatic: boolean, isFunction: boolean, id: string, listParams: Array<Node>, instructions: Array<Node>) {
		super(positionToken, type, token);
        this._isStatic = isStatic;
		this._isFunction = isFunction;
		this._id = id;
		this._listParams = listParams;
		this._instructions = instructions;
	}

    /**
     * Getter isStatic
     * @return {boolean}
     */
	public get isStatic(): boolean {
		return this._isStatic;
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
     * Getter encapsulationType
     * @return {EncapsulationType}
     */
	public get encapsulationType(): EncapsulationType {
		return this._encapsulationType;
	}

    /**
     * Getter isOverride
     * @return {boolean}
     */
	public get isOverride(): boolean {
		return this._isOverride;
	}

    /**
     * Setter isStatic
     * @param {boolean} value
     */
	public set isStatic(value: boolean) {
		this._isStatic = value;
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
     * Setter encapsulationType
     * @param {EncapsulationType} value
     */
	public set encapsulationType(value: EncapsulationType) {
		this._encapsulationType = value;
	}

    /**
     * Setter isOverride
     * @param {boolean} value
     */
	public set isOverride(value: boolean) {
		this._isOverride = value;
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
            handlerComprobation.getAmbitS(),                                //nameCode
            this.id,                                //name
            this.isFunction? SymbolType.FUNCTION : SymbolType.PROCEDURE,//symbolType
            this.isFunction,                        //isFunction
            this.type,                              //type, tipo de dato
            this.listParams.length,                 //numParams
            listTypeParams,                         //listParams
            null, //direccion o el numero de puntero para la pila de ejecucion
            handlerComprobation.sizeFuncProc,       //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                                  //isReference
            this.encapsulationType,                     //encapsulationType
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            false                                   //isConst
        );

        newSymbol.ambit = handlerComprobation.actualClass.name;

        handlerComprobation.addSymbol(newSymbol);
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

    private addSymbolReturn(handlerComprobation: HandlerComprobation){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            null,                                //nameCode
            "return",                                //name
            SymbolType.RETURN,                 //symbolType
            false,                        //isFunction
            this.type,                              //type, tipo de dato
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
        //Buscar que no exista otro simbolo con ese nombre
        const symbolFunc = handlerComprobation.searchSymbol(this.id);
        if (symbolFunc) {
            //Error ya existe alguna simbolo con ese nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una simbolo con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return this.type;
        }

        //agregar ambito
        handlerComprobation.addAmbitS(this.id);
        handlerComprobation.addAmbit();
        handlerComprobation.sizeFuncProc = 0;

        // Comprobaciones de extends si es override

        this.addSymbol(handlerComprobation, []);
        this.addSymbolThis(handlerComprobation);

        let listTypeParams: Array<DynamicDataType> = new Array<DynamicDataType>;
        //Verificar que los parametros sean correctos
        for (let j = 0; j < this.listParams.length; j++) {
            const resParam = this.listParams[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            listTypeParams.push(resParam);
        }

        // ejecutar las comprobaciones de las instrucciones
        for (let i = 0; i < this.instructions.length; i++) {
            this.instructions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (this.instructions[i] instanceof ReturnNode) {
                if (this.isFunction) {
                    const returnNode = this.instructions[i] as ReturnNode;
                    if (returnNode.type.name != this.type.name) {
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `EL metodo << ${this.id} >>no es del mismo tipo que el valor de retorno.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                        return ;
                    }
                    break;
                    // return returnNode.type;  
                } else {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `EL metodo << ${this.id} >>no es un funcion, por lo que no se puede usar el key return.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
                
            }
        }

        //agregar el simbolo return
        if (this.isFunction) {
            this.addSymbolReturn(handlerComprobation);
        }
        
        this.size = handlerComprobation.sizeFuncProc;
        handlerComprobation.setListParamsTableSymbol(this.id, handlerComprobation.actualClass.name, listTypeParams);
        handlerComprobation.setListSizeTableSymbol(this.id, handlerComprobation.actualClass.name, this.size);



        //sacar el ambito
        
        handlerComprobation.popAmbit();
        handlerComprobation.popAmbitS();
        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();

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
