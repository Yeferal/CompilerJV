import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { DeclarationType } from "../utils/declaration-type";
import { EncapsulationType } from "../utils/encapsulation-type";
import { DeclarationArray } from "./declaration-array";
import { DeclarationVar } from "./declaration-var";


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


    /**
     * Getter declarationType
     * @return {DeclarationType}
     */
	public get declarationType(): DeclarationType {
		return this._declarationType;
	}

    /**
     * Getter isGetter
     * @return {boolean}
     */
	public get isGetter(): boolean {
		return this._isGetter;
	}

    /**
     * Getter isSetter
     * @return {boolean}
     */
	public get isSetter(): boolean {
		return this._isSetter;
	}

    /**
     * Getter encapsulationType
     * @return {EncapsulationType}
     */
	public get encapsulationType(): EncapsulationType {
		return this._encapsulationType;
	}

    /**
     * Getter isFinal
     * @return {boolean}
     */
	public get isFinal(): boolean {
		return this._isFinal;
	}

    /**
     * Getter isStatic
     * @return {boolean}
     */
	public get isStatic(): boolean {
		return this._isStatic;
	}

    /**
     * Getter listDeclaration
     * @return {Array<Node>}
     */
	public get listDeclaration(): Array<Node> {
		return this._listDeclaration;
	}

    /**
     * Setter declarationType
     * @param {DeclarationType} value
     */
	public set declarationType(value: DeclarationType) {
		this._declarationType = value;
	}

    /**
     * Setter isGetter
     * @param {boolean} value
     */
	public set isGetter(value: boolean) {
		this._isGetter = value;
	}

    /**
     * Setter isSetter
     * @param {boolean} value
     */
	public set isSetter(value: boolean) {
		this._isSetter = value;
	}

    /**
     * Setter encapsulationType
     * @param {EncapsulationType} value
     */
	public set encapsulationType(value: EncapsulationType) {
		this._encapsulationType = value;
	}

    /**
     * Setter isFinal
     * @param {boolean} value
     */
	public set isFinal(value: boolean) {
		this._isFinal = value;
	}

    /**
     * Setter isStatic
     * @param {boolean} value
     */
	public set isStatic(value: boolean) {
		this._isStatic = value;
	}

    /**
     * Setter listDeclaration
     * @param {Array<Node>} value
     */
	public set listDeclaration(value: Array<Node>) {
		this._listDeclaration = value;
	}
    

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        for (let i = 0; i < this.listDeclaration.length; i++) {
            // this.listDeclaration[i].type = this.DynamicDataType;

            // if (this.listDeclaration[i] instanceof DeclarationVar) {
                
            // } else if (this.listDeclaration[i] instanceof DeclarationArray) {
                
            // }
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
        throw new Error("Method not implemented.");
    }
}
