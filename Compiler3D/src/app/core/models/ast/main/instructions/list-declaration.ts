import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { DeclarationType } from "../utils/declaration-type";
import { EncapsulationType } from "../utils/encapsulation-type";
import { DeclarationArray } from "./declaration-array";
import { DeclarationAtribute } from "./declaration-atribute";
import { DeclarationParam } from "./declaration-param";
import { DeclarationVar } from "./declaration-var";
import { DeclarationVarible } from "./declaration-variable";


export class ListDeclaration extends Node {
    private _declarationType: DeclarationType; //Si es de atributos variables o parametros
    private _isGetter: boolean; // De Atributos
    private _isSetter: boolean; // De Atributos
    private _encapsulationType: EncapsulationType; // En caso de que sea de atributos
    private _isFinal: boolean; // De Atributos y Variables
    private _isStatic: boolean; // De Atributos
    // private _isArray: boolean; // Si es una declaracion de arreglos
    private _listDeclaration: Array<Node>;

	constructor(positionToken: PositionToken, type: DynamicDataType, toke: string, declarationType: DeclarationType, isGetter: boolean, isSetter: boolean, encapsulationType: EncapsulationType, isFinal: boolean, isStatic: boolean, listDeclaration: Array<Node>) {
		super(positionToken, type, toke);
        this._declarationType = declarationType;
		this._isGetter = isGetter;
		this._isSetter = isSetter;
		this._encapsulationType = encapsulationType;
		this._isFinal = isFinal;
		this._isStatic = isStatic;
		this._listDeclaration = listDeclaration;
	}

	public get declarationType(): DeclarationType {
		return this._declarationType;
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
	public get listDeclaration(): Array<Node> {
		return this._listDeclaration;
	}
	public set declarationType(value: DeclarationType) {
		this._declarationType = value;
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

	public set listDeclaration(value: Array<Node>) {
		this._listDeclaration = value;
	}

    
    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        for (let i = 0; i < this.listDeclaration.length; i++) {
            if (this.listDeclaration[i] instanceof DeclarationAtribute) {
                const declarationAtribite = this.listDeclaration[i] as DeclarationAtribute;
                declarationAtribite.isSetter = this.isSetter;
                declarationAtribite.isGetter = this.isGetter;
                declarationAtribite.isStatic = this.isStatic;
                declarationAtribite.isFinal = this.isFinal;
                declarationAtribite.encapsulationType = this.encapsulationType;
                declarationAtribite.type = this.type;
				
            } else if (this.listDeclaration[i] instanceof DeclarationArray) {
				const declarationArray = this.listDeclaration[i] as DeclarationArray;
				declarationArray.isSetter = this.isSetter;
                declarationArray.isGetter = this.isGetter;
                declarationArray.isStatic = this.isStatic;
                declarationArray.isFinal = this.isFinal;
                declarationArray.encapsulationType = this.encapsulationType;
                declarationArray.type = this.type;
			} else if (this.listDeclaration[i] instanceof DeclarationParam) {
				const declarationParam = this.listDeclaration[i] as DeclarationParam;
                declarationParam.type = this.type;
			} else if (this.listDeclaration[i] instanceof DeclarationVar) {
				const declarationVar = this.listDeclaration[i] as DeclarationVar;
                declarationVar.isFinal = this.isFinal;
                declarationVar.type = this.type;
			} else if (this.listDeclaration[i] instanceof DeclarationVarible) {
				const declarationVarible = this.listDeclaration[i] as DeclarationVarible;
                declarationVarible.isFinal = this.isFinal;
                declarationVarible.type = this.type;
			}

            this.listDeclaration[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            
        }

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
        for (let i = 0; i < this.listDeclaration.length; i++) {
			this.listDeclaration[i].execute(environment);
		}
		
    }
}
