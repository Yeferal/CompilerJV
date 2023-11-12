import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { LogicalOperation } from "../expressions/logical-operation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";
import { CallArray } from "./call-array";
import { CallFunction } from "./call-function";
import { CallFunctionObject } from "./call-function-object";
import { CallMath } from "./call-math";
import { CallValueObject } from "./call-value-object";
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";
import { InstanceObject } from "./instance-object";

export class DeclarationVar extends Node {

    private _isFinal: boolean;

    private _id: string;
    private _asignation: Node;
    private _isReference: boolean = false;

    public isArray = false;
    public listDims: Array<number>;

	constructor(positionToken: PositionToken, toke: string, id: string, asignation: Node, isFinal: boolean) {
		super(positionToken, null, toke);
		this._id = id;
		this._asignation = asignation;
    this._isFinal = isFinal;
	}


    /**
     * Getter isFinal
     * @return {boolean}
     */
	public get isFinal(): boolean {
		return this._isFinal;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Getter isReference
     * @return {boolean }
     */
	public get isReference(): boolean  {
		return this._isReference;
	}

    /**
     * Setter isFinal
     * @param {boolean} value
     */
	public set isFinal(value: boolean) {
		this._isFinal = value;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
	}

    /**
     * Setter isReference
     * @param {boolean } value
     */
	public set isReference(value: boolean ) {
		this._isReference = value;
	}


    public addSymbol(handlerComprobation: HandlerComprobation){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            null,                                //nameCode
            this.id,                                //name
            SymbolType.VAR,                         //symbolType
            false,                                  //isFunction
            this.type,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,                                      //Tamanio del symbol
            this.isArray,                                  //isArray
            this.listDims,                                   //listDims
            this.isReference,                       //isReference
            EncapsulationType.PUBLIC,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            this.isFinal                            //isConst
        );

        newSymbol.ambit = handlerComprobation.getAmbitS();

        handlerComprobation.addSymbol(newSymbol);
        handlerComprobation.sizeFuncProc++;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Verifica que no exista otra simbolo con el mismo nombre
        const resName = handlerComprobation.searchSymbol(this.id);

        //Falta agregar si el simbolo es un parametro entonces que use el this como referencia
        if (resName != null) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
            return;
        }

        //Verificar el tipo de asignacion
        if (this.asignation != null) {
            const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            if (resAsig != null) {
                this.type = resAsig;
                if (this.asignation instanceof Identifier) {
                    const identifier = this.asignation as Identifier;
                    let symbol;
                    if (identifier.isThis) {
                        symbol = handlerComprobation.searchSymbolThis(identifier.id);
                    } else {
                        symbol = handlerComprobation.searchSymbol(identifier.id);
                    }
                    this.isArray = symbol.isArray;
                    this.listDims = symbol.listDims;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof DataArray) {
                    const dataArray = this.asignation as DataArray;
                    this.isArray = true;
                    // this.listDims = ;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof InstanceArray) {
                    const instanceArray = this.asignation as InstanceArray;
                    this.isArray = true;
                    this.listDims = null;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof InstanceObject) {
                    const instacneObject = this.asignation as InstanceObject;
                    this.isArray = false;
                    this.listDims = null;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof CallArray){
                    const callArray = this.asignation as CallArray;   
                    this.isArray = false;
                    this.listDims = null;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof CallFunction){
                    const callFunction = this.asignation as CallFunction;
                    this.isArray = false;
                    this.listDims = null;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof CallFunctionObject){
                    const callFunctionObject = this.asignation as CallFunctionObject;
                    this.isArray = false;
                    this.listDims = null;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof CallValueObject){
                    const callValueObject = this.asignation as CallValueObject;
                    let symbolObj = handlerComprobation.searchSymbol(callValueObject.idObj);
                    let symbol = handlerComprobation.searchSymbolAtribClass(callValueObject.id, symbolObj.type.name);
                    this.isArray = symbol.isArray;
                    this.listDims = symbol.listDims;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else if (this.asignation instanceof CallMath) {
                    const callMath = this.asignation as CallMath;
                    this.isArray = false;
                    this.listDims = null;
                    this.addSymbol(handlerComprobation);
                    return this.type;
                }
                
                
                //Agreagar a la tabla de simbolos
                this.addSymbol(handlerComprobation);
                return this.type;

            }else {
                //error
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
                handlerComprobation.listError.push(errorGramm);
                return;
            }
        } else {
            //error
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
            return;
        }
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

    public addPointString(environment: Environment){
        if (this.type.name == "STRING") {
            if (environment.isClass) {
                
            } else {
                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Asignando posicion del string en el stackS", arg2: null, result: null});
                const ps = environment.addPs();
                let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());
                const tTemp = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp);
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: ps, arg2: null, result: "t"+tTemp});
                
            }
        }
    }

    public gen3DGeneral(environment: Environment){
        let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());

        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de "+this.id, arg2: null, result: null});
        
        const tTemp = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

        return tTemp;
    }

    public override execute(environment: Environment): any {

        this.addPointString(environment);
        
        environment.isAsig = true;
        let tAsig = this.asignation.execute(environment);
        environment.isAsig = false;

        if (this.asignation instanceof LogicalOperation) {
            tAsig = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tAsig);
            tAsig = "t"+tAsig;
            const etJump = environment.addEt();
            if (!environment.etTrue.isEmpty()) {
                while (!environment.etTrue.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etTrue.pop()});
                }
            }
            //Aqui va el valor del t verdadero
            environment.handlerQuartet.insertQuartet({operator: "=", arg1: "1", arg2: null, result: tAsig});
            environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etJump});

            if (!environment.etFalse.isEmpty()) {
                while (!environment.etFalse.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etFalse.pop()});
                }
            }
            //Aqui va el valor del t FALSO
            environment.handlerQuartet.insertQuartet({operator: "=", arg1: "0", arg2: null, result: tAsig});
            environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etJump});
        }



        if (environment.isClass) {
                
        } else {
            
            if (this.type.name == "STRING") {
                const tTemp = this.gen3DGeneral(environment);
                
                const tTemp2 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_declar_i", arg1: "t"+tTemp, arg2: null, result: "t"+tTemp2});
                environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1:  tAsig, arg2: null, result: "t"+tTemp2});

            } else if (this.type.name == "FLOAT") {
                const tTemp = this.gen3DGeneral(environment);

                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else if (this.type.name == "CHAR") {
                const tTemp = this.gen3DGeneral(environment);

                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else if (this.type.name == "INTEGER") {
                const tTemp = this.gen3DGeneral(environment);

                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else if (this.type.name == "BOOLEAN") {
                const tTemp = this.gen3DGeneral(environment);

                // environment.handlerQuartet.listTempsInt.push(tTemp2);
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
            } else {
                let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());
                if (this.asignation instanceof InstanceObject) {
    
                    environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del constructor o Return", arg2: null, result: null});
                    
                    //Mover el puntero temporalmente
                    const tTemp = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: environment.sizeMain, result: "t"+tTemp});
    
                    //Obtener la direcciones del this
                    const tTemp2 = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp, arg2: "0", result: "t"+tTemp2});
    
                    //Obtener la direcciones de valor this
                    const tTemp3 = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTemp2, arg2: null, result: "t"+tTemp3});
    
                    //Asignar la referencia a la variable
                    const tTemp4 = environment.addT();
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp4});
    
                    // environment.handlerQuartet.listTempsInt.push(tTemp2);
                    environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                } else {
                    const tTemp = this.gen3DGeneral(environment);

                    // environment.handlerQuartet.listTempsInt.push(tTemp2);
                    environment.handlerQuartet.insertQuartet({operator: "stack_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp});
                }
            }
        }
    }
}
