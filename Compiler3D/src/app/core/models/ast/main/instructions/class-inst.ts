import { Quartet } from "../../../tree-direction/quartet";
import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { ImportNode } from "../import-node";
import { Node } from "../node";
import { PackageNode } from "../package-node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";
import { ConstructorInst } from "./constructor-inst";
import { FunctionProcedure } from "./function-procedure";
import { ListDeclaration } from "./list-declaration";
import { MainNode } from "./main-node";

export class ClassInst extends Node {
    private _isGetter: boolean;
    private _isSetter: boolean;

    private _name: string;
    private _nameExtends: string;
    private _isPublic: boolean;
    private _isFinal: boolean;
    private _instructions: Array<Node>;
    private _packageNode: PackageNode;
    private _listImport: Array<ImportNode>;

	constructor(positionToken: PositionToken, token: string, isGetter: boolean, isSetter: boolean, name: string, nameExtends: string, isPublic: boolean, isFinal: boolean, instructions: Array<Node>) {
		super(positionToken, null, token);
        this._isGetter = isGetter;
		this._isSetter = isSetter;
		this._name = name;
		this._nameExtends = nameExtends;
		this._isPublic = isPublic;
		this._isFinal = isFinal;
		this._instructions = instructions;
	}

	public get isGetter(): boolean {
		return this._isGetter;
	}

	public get isSetter(): boolean {
		return this._isSetter;
	}

	public get name(): string {
		return this._name;
	}

	public get nameExtends(): string {
		return this._nameExtends;
	}

	public get isPublic(): boolean {
		return this._isPublic;
	}

	public get isFinal(): boolean {
		return this._isFinal;
	}

	public get instructions(): Array<Node> {
		return this._instructions;
	}

	public set isGetter(value: boolean) {
		this._isGetter = value;
	}

	public set isSetter(value: boolean) {
		this._isSetter = value;
	}

	public set name(value: string) {
		this._name = value;
	}

	public set nameExtends(value: string) {
		this._nameExtends = value;
	}

	public set isPublic(value: boolean) {
		this._isPublic = value;
	}

	public set isFinal(value: boolean) {
		this._isFinal = value;
	}

	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}

	public get packageNode(): PackageNode {
		return this._packageNode;
	}

	public get listImport(): Array<ImportNode> {
		return this._listImport;
	}

	public set packageNode(value: PackageNode) {
		this._packageNode = value;
	}

	public set listImport(value: Array<ImportNode>) {
		this._listImport = value;
	}


    public addSymbol(handlerComprobation: HandlerComprobation, size: number){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            this.name,                                //nameCode
            this.name,                                //name
            SymbolType.CLASS,                         //symbolType
            false,                                  //isFunction
            null,                          //type, tipo de dato
            0,                                      //numParams
            null,                                   //listParams
            // handlerComprobation.getAndAddPointer(), //direccion o el numero de puntero para la pila de ejecucion
            null,
            size,                                      //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                       //isReference
            EncapsulationType.PUBLIC,                     //encapsulation
            handlerComprobation.getPackageRoot()+this.name,//fullname, desde que paquete hasta el id
            this.isFinal                            //isFinal
        );

        // newSymbol.ambit = handlerComprobation.getAmbitS();
        if (this.nameExtends != null) {
            newSymbol.parent = this.nameExtends
        }
        newSymbol.packageS = handlerComprobation.actualPKG.path;

        handlerComprobation.addSymbol(newSymbol);
        
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        handlerComprobation.actualPKG = this.packageNode;

        //Buscar que no exista una clase con ese nombre, que exista el extends
        const classSearch = handlerComprobation.searchSymbol(this.name);
        
        if (classSearch != null) {
            //Error ya existe una clase con ese nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.name, `Ya existe una clase << ${this.name} >> dentro del ambito.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.isFinal) {
            if (this.nameExtends != null) {
                //Error la clase no puede ser extendida
                const errorGramm = new ErrorGramm(this.positionToken, this.name, `La clase << ${this.name} >> no puede ser extendida porque contiene la key final.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
                return ;
            }
        } else {
            if (this.nameExtends != null) {
                const extendSearch = handlerComprobation.searchSymbol(this.nameExtends);
                if (extendSearch == null) {
                    //Error no existe una clase con ese nombre
                    const errorGramm = new ErrorGramm(this.positionToken, this.name, `No existe una Clase << ${this.nameExtends} >> dentro del ambito.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
            }
        }
        let countSize = 0;
        for (let i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i] instanceof ListDeclaration) {
                const listDeclaration = this.instructions[i] as ListDeclaration;
                countSize += listDeclaration.listDeclaration.length;
            }
        }
        
        //SI todo esta bien agregar a la tabla de simbolos la clase
        //Agregar a la tabla de simbolos la clase
        this.type = new DynamicDataType(1, this.name, countSize);
        handlerComprobation.typeTable.setSizeType(this.name, countSize);
        this.addSymbol(handlerComprobation, countSize);
        handlerComprobation.clearAmbitS();
        handlerComprobation.addAmbitS(this.name);
        handlerComprobation.addAmbit();
        
        // Cuando agrega el getter y setter a las listas de declaraciones
        if (this.isGetter || this.isSetter) {
            for (let i = 0; i < this.instructions.length; i++) {
                const instruction = this.instructions[i];
                if (instruction instanceof ListDeclaration) {
                    const listDeclaration = instruction as ListDeclaration;
                    if (listDeclaration.encapsulationType == EncapsulationType.PRIVATE) {
                        if (this.isGetter) {
                            listDeclaration.isGetter = this.isGetter;
                        }

                        if (this.isGetter) {
                            listDeclaration.isSetter = this.isSetter;
                        }
                    }
                }
            }
        }
        
        handlerComprobation.sizeFuncProc = 0;
        //Reccorre las declaracion
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            if (instruction instanceof ListDeclaration) {
                // console.log("lista de declaracion");
                const listDeclaration = instruction as ListDeclaration;
                listDeclaration.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            }
        }

        

        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();
        //Obtiene las lista de funciones pero para recolectar los nombres
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            if (instruction instanceof FunctionProcedure) {
                const functionProc = instruction as FunctionProcedure;
                functionProc.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                
            }
        }

        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();
        //Obtiene el Constructor
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            if (instruction instanceof ConstructorInst) {
                // console.log("lista de declaracion");
                const listDeclaration = instruction as ConstructorInst;
                listDeclaration.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            }
        }

        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();
        handlerComprobation.clearAmbitS();

        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            if (instruction instanceof MainNode) {
                const mainNode = instruction as MainNode;
                mainNode.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            }
        }

        handlerComprobation.popAmbit();
        handlerComprobation.popAmbitS();
        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();
        handlerComprobation.clearAmbitS();
        
        this.isRunning = true;
        return ;

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
        const symbolClass = environment.symbolTable.searchSymbolClass(this.name);
        // tm1 = h
        const nT1 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(nT1);
        environment.handlerQuartet.insertQuartet({operator: "=", arg1: "h", arg2: null, result: "t"+nT1});
        // h = h + tamanio clase
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "h", arg2: symbolClass.size, result: "h"});
        // tm2 = ptr + 0
        const nT2 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(nT2);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: "0", result: "t"+nT2});
        // stack[tm2] = tm1
        environment.handlerQuartet.insertQuartet({operator: "stack_asig", arg1: "t"+nT1, arg2: null, result: "t"+nT2});

    }

    public override execute(environment: Environment): any {
        environment.ambitNow.push(environment.acutalClass.name);
        //Primero el constructor
        let isExisteConstructor = false;
        for (let i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i] instanceof ConstructorInst) {
                isExisteConstructor = true;
                //Generar los cuartetos de las instruciones que contiene el constructor
                this.instructions[i].execute(environment);
                break;
            }
        }

        // Si no existe, crear un constructor vacio
        if (!isExisteConstructor) {
            environment.handlerQuartet.insertQuartet({operator: "constructor", arg1: this.name, arg2: this.name, result: null});

            this.generatePrincipalQuartet(environment);

            // Segunto los atributos
            for (let i = 0; i < this.instructions.length; i++) {
                if (this.instructions[i] instanceof ListDeclaration) {
                    this.instructions[i].execute(environment);
                }
            }
            
            environment.handlerQuartet.insertQuartet({operator: "close", arg1: null, arg2: null, result: null});
        }

        

        //Tercero las funciones
        for (let i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i] instanceof FunctionProcedure) {
                this.instructions[i].execute(environment);
            }
        }

        //Cuarto preparar Main
        for (let i = 0; i < this.instructions.length; i++) {
            if (this.instructions[i] instanceof MainNode) {
                
                this.instructions[i].isClass = true;
                this.instructions[i].nameClass = this.name;
                // console.log(this.instructions[i]);
                break;
            }
        }

        environment.ambitNow.pop();
        
    }
}
