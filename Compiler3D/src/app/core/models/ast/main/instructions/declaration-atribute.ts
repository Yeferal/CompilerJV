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
import { DataArray } from "./data-array";
import { InstanceArray } from "./instance-array";
export class DeclarationAtribute extends Node{

    //Atributos propios de una Declaracion de un Atributo
    private _isGetter: boolean;
    private _isSetter: boolean;
    private _encapsulationType: EncapsulationType;
    //Atributos de una Variable o Atributo
    private _isFinal: boolean;
    private _isStatic: boolean;
    private _id: string;
    private _asignation: Node;

	constructor(positionToken: PositionToken, type: DynamicDataType, token: string, id: string, asignation: Node) {
		super(positionToken, type, token);
		this._id = id;
		this._asignation = asignation;
	}

	public get isGetter(): boolean {
		return this._isGetter;
	}

	public get isSetter(): boolean {
		return this._isSetter;
	}

	public get encapsulationType(): EncapsulationType {
		return this._encapsulationType;
	}

	public get isFinal(): boolean {
		return this._isFinal;
	}

	public get isStatic(): boolean {
		return this._isStatic;
	}

	public get id(): string {
		return this._id;
	}

	public get asignation(): Node {
		return this._asignation;
	}

	public set isGetter(value: boolean) {
		this._isGetter = value;
	}

	public set isSetter(value: boolean) {
		this._isSetter = value;
	}

	public set encapsulationType(value: EncapsulationType) {
		this._encapsulationType = value;
	}

	public set isFinal(value: boolean) {
		this._isFinal = value;
	}

	public set isStatic(value: boolean) {
		this._isStatic = value;
	}

	public set id(value: string) {
		this._id = value;
	}

	public set asignation(value: Node) {
		this._asignation = value;
	}
    

    public addSymbol(handlerComprobation: HandlerComprobation){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            null,                                //nameCode
            this.id,                                //name
            SymbolType.ATRIBUT,                         //symbolType
            false,                                  //isFunction
            this.type,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            1,                                      //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                       //isReference
            this.encapsulationType,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.id,//fullname, desde que paquete hasta el id
            this.isFinal                            //isFinal
        );
        newSymbol.isStatic = this.isStatic;
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
        
        if (resName != null) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Ya existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        //Comprobamos los getter y setters, static, final, encapsulamiento
        if (this.isStatic || this.isFinal) {
            if (this.isGetter || this.isSetter) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los decaradores getter y setter no pueden se usados en declaraciones static o final<< ${this.id}>>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        }

        if (this.isFinal && this.asignation == null) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `Una declaracion final debe de tener un valor de asignacion << ${this.id}>>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.encapsulationType != EncapsulationType.PRIVATE) {
            if (this.isGetter || this.isSetter) {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los decaradores getter y setter solo pueden ser usados con encapsulamiento private << ${this.id}>>.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        }

        if (!handlerComprobation.isExistType(this.type.name)) {  
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato << ${this.type.name}>> no existe.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isGetter) {
            handlerComprobation.listGetters.push(this);
        }
        if (this.isSetter) {
            handlerComprobation.listSetters.push(this);
        }

        //Verificar el tipo de asignacion
        if (this.asignation != null) {
            const resAsig: DynamicDataType = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            
            if (!handlerComprobation.isExistType(resAsig.name)) {  
                const errorGramm = new ErrorGramm(this.asignation.positionToken, this.asignation.token, `El tipo de dato << ${resAsig.name}>> no existe.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }

            if (resAsig != null) {
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
            const ps = environment.addPs();
            let symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.ambitNow.peek());
            const tTemp = environment.addT();
            environment.handlerQuartet.listTempsInt.push(tTemp);
            environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbol.direction, result: "t"+tTemp});
            environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: ps, arg2: null, result: "t"+tTemp});
        }
    }

    private asigDimsArray(symbol: Symbol){
        if (symbol.isArray) {
            if (this.asignation instanceof Identifier) {
                const identifier = this.asignation as Identifier;
                symbol.listDimsTemps = identifier.dimsT;
            } if (this.asignation instanceof DataArray) {
                const dataArray = this.asignation as DataArray;
                symbol.listDimsTemps = dataArray.dimsT;
            } if (this.asignation instanceof InstanceArray) {
                const instanceArray = this.asignation as InstanceArray;
                symbol.listDimsTemps = instanceArray.dimsT;
            }
        }
    }

    public override execute(environment: Environment): any {
        
        this.addPointString(environment);

        if (this.asignation != null) {
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

            const symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);
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

            if (this.type.name == "STRING") {
                const tTemp4 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp4);
                // Tiene que ir a buscar el valor del string en la pila de strings
                // Obtenemos la posicion en el stackS
                environment.handlerQuartet.insertQuartet({operator: "heap_declar_i", arg1: "t"+tTemp3, arg2: null, result: "t"+tTemp4});
                environment.handlerQuartet.insertQuartet({operator: "stack_string_asig", arg1: tAsig, arg2: null, result: "t"+tTemp4});
            } else if (this.type.name == "FLOAT") {
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_f", arg1: tAsig, arg2: null, result: "t"+tTemp3});
            } else if (this.type.name == "CHAR") {
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
            } else if (this.type.name == "INTEGER") {
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
            } else {
                //Si es un valor de tipo objeto y no primitivo
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: tAsig, arg2: null, result: "t"+tTemp3});
            }
        } else {
            const symbol = environment.symbolTable.searchSymbolAtribClass(this.id, environment.acutalClass.name);

            if (this.type.name == "STRING") {
                
            } else if (this.type.name == "FLOAT") {
                
            } else if (this.type.name == "CHAR") {
                
            } else if (this.type.name == "INTEGER") {
                
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

                //Si es un valor de tipo objeto y no primitivo
                environment.handlerQuartet.insertQuartet({operator: "heap_asig_i", arg1: "-1", arg2: null, result: "t"+tTemp3});
            }
        }


    }
}
