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

    public override execute(environment: Environment): any {
        throw new Error("Method not implemented.");
    }
}
