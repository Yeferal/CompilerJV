import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { LogicalOperation } from "../expressions/logical-operation";
import { Node } from "../node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";

export class DeclarationVarible extends Node{
    private _isFinal: boolean;

    private _id: string;
    private _asignation: Node;
    private _isReference: boolean = false;

	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, id: string, asignation: Node) {
		super(positionToken, type, toke);
		this._id = id;
		this._asignation = asignation;
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
     * Getter isReference
     * @return {boolean }
     */
	public get isReference(): boolean  {
		return this._isReference;
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
            false,                                  //isArray
            null,                                   //listDims
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
        if (this.type == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El token o id << ${this.id}>>, no tine tipo de dato.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        //Verifica que no exista otra simbolo con el mismo nombre
        const resName = handlerComprobation.searchSymbol(this.id);

        //Falta agregar si el simbolo es un parametro entonces que use el this como referencia
        if (resName != null) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isFinal && this.asignation == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Una declaracion final debe de tener un valor de asignacion << ${this.id}>>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (!handlerComprobation.isExistType(this.type.name)) {  
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato << ${this.type.name}>> no existe.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        //Verificar el tipo de asignacion
        if (this.asignation != null) {
            
            const resAsig: DynamicDataType = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);

            if (resAsig != null) {
                if (!handlerComprobation.isExistType(resAsig.name)) {  
                    const errorGramm = new ErrorGramm(this.asignation.positionToken, this.asignation.token, `El tipo de dato << ${resAsig.name}>> no existe.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }

                if ( this.type.name == resAsig.name) {
                    //Agreagar a la tabla de simbolos
                    this.addSymbol(handlerComprobation);
                    return this.type;
                } else {
                    //Verificar si la asignacion es posible, por ejemplo que se de tipo int y que la asignacion sea un char lo cual se puede
                    const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
                    if (resVeri != null) {
                        //Agreagar a la tabla de simbolos
                        this.addSymbol(handlerComprobation);
                        return this.type;
                    }
                    //error
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignacion.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);

                }
            }else {
                //error
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        } else {
            //Agreagar a la tabla de simbolos
            this.addSymbol(handlerComprobation);
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
            environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Asignando posicion del string en el stackS", arg2: null, result: null});
            const ps = environment.addPs();
            let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());
            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});
            environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: ps, arg2: null, result: "t"+tTemp});
        }
    }

    public gen3DGeneral(environment: Environment){
        let symbol = environment.symbolTable.searchSymbolVar(this.id, environment.ambitNow.peek());

        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo la posicion de d"+this.id, arg2: null, result: null});
        
        const tTemp = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});

        return tTemp;
    }

    public override execute(environment: Environment): any {
        this.addPointString(environment);
        if (this.asignation != null) {
            environment.isAsig = true;
            let tAsig = this.asignation.execute(environment);
            environment.isAsig = false;
            //Si la asingacion es una operacion booleana
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

                    environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del constructor", arg2: null, result: null});
                    
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
                }
            }
        }
        
        
    }
}