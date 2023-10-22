import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";

export class DeclarationParam extends Node {
    private _DynamicDataType: DynamicDataType;
    private _id: string;
    private _encapsulation: string = "public"
    isReference: boolean = false;

    constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, DynamicDataType: DynamicDataType, id: string, asignation: Node, isParama: boolean, encapsulation: string ) {
		super(positionToken, type, toke);
		this._DynamicDataType = DynamicDataType;
		this._id = id;
        this._encapsulation = encapsulation;
	}

    public get DynamicDataType(): DynamicDataType {
        return this._DynamicDataType;
    }

    public set DynamicDataType(value: DynamicDataType) {
        this._DynamicDataType = value;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

	public get encapsulation(): string  {
		return this._encapsulation;
	}

	public set encapsulation(value: string ) {
		this._encapsulation = value;
	}

    public addSymbol(handlerComprobation: HandlerComprobation){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            this.id,                                //nameCode
            this.id,                                //name
            SymbolType.PARAM,                       //symbolType
            false,                                  //isFunction
            this.DynamicDataType,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,                                      //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            this.isReference,                       //isReference
            this.encapsulation,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            false                           //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();

        handlerComprobation.symbolTable.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Verifica que no exista otra simbolo con el mismo nombre
        const resName = handlerComprobation.symbolTable.searchSymbol(this.id);
        if (resName) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return this.DynamicDataType;
        }

        //Agreagar a la tabla de simbolos
        this.addSymbol(handlerComprobation);
        return this.DynamicDataType;
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
