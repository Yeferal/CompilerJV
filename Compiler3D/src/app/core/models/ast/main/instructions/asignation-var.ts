import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Identifier } from "../expressions/identifier";
import { Node } from "../node";
import { SymbolType } from "../table/symbol-type";

export class AsignationVar extends Node {
    private _id: string;
    private _asignation: Node;
    private _isThis: boolean;
    private _isArray: boolean;

	constructor(positionToken: PositionToken, token: string, id: string, asignation: Node, isThis: boolean, isArray: boolean) {
        super(positionToken, null, token);
		this._id = id;
		this._asignation = asignation;
        this._isThis = isThis;
        this._isArray = isArray;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Getter asignation
     * @return {Node}
     */
	public get asignation(): Node {
		return this._asignation;
	}

    /**
     * Setter asignation
     * @param {Node} value
     */
	public set asignation(value: Node) {
		this._asignation = value;
	}

    /**
     * Getter isThis
     * @return {boolean}
     */
	public get isThis(): boolean {
		return this._isThis;
	}

    /**
     * Setter isThis
     * @param {boolean} value
     */
	public set isThis(value: boolean) {
		this._isThis = value;
	}

    /**
     * Getter isArray
     * @return {boolean}
     */
	public get isArray(): boolean {
		return this._isArray;
	}

    /**
     * Setter isArray
     * @param {boolean} value
     */
	public set isArray(value: boolean) {
		this._isArray = value;
	}


    public isTypeCorrect(typeAsig: SymbolType): boolean{
        const typesCorrect = [SymbolType.ATRIBUT, SymbolType.KEY_WORD, SymbolType.PARAM, SymbolType.VAR];
        return typesCorrect.includes(typeAsig);
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resName = handlerComprobation.searchSymbol(this.id);
        if (!resName) {
            //error de nombre, ya existe un simbolo en el ambito con el mismo nombre
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe una variable con el nombre: << ${this.id}>>, dentro del mismo ambito.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
        } else {
            this.type = resName.type;

            if (!this.isTypeCorrect(resName.symbolType)) {
                //error de tipo de simbolo, no es un simbolo de tipo variable asignable
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `La simbolo << ${this.id}>> no es una variable, atributo o parametro.`, ErrorType.SEMANTIC);
                handlerComprobation.listError.push(errorGramm);
            } else {
                //Verificamos que no se una constante
                if (resName.isConst) {
                    //error porque es una constante que no puede ser cambiada
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `La variable es una constante: << ${this.id}>>, no es asignable.`, ErrorType.SEMANTIC);
                    handlerComprobation.listError.push(errorGramm);
                    // return this.type;
                }
            }


        }

        const resAsig = this.asignation.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resAsig) {
            if ( this.type == resAsig) {
                //En caso de que sea una asignacion por medio de una variable
                if (this.asignation instanceof Identifier) {
                    const identifier: Identifier = this.asignation as Identifier;
                    const symbolIdentifier = handlerComprobation.searchSymbol(identifier.id);
                    if (symbolIdentifier.isArray) {
                        //error de tipo de simbolo, no es un arreglo
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `La simbolo << ${identifier.id}>> es un variable de tipo arreglo.`, ErrorType.SEMANTIC);
                        handlerComprobation.listError.push(errorGramm);
                    }
                }

                return this.type;
            } else {
                //Verificar si la asignation es posible, por ejemplo que se de tipo int y que la asignation sea un char lo cual se puede
                const resVeri = this._typeVerifier.verifierTypeAsignationNode(this.type, resAsig);
                if (!resVeri) {
                    //error
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> El tipo de dato de la variable ${this.id} no es compatible con el tipo de dato de la asignation.`, ErrorType.SEMANTIC);
                    handlerComprobation.listError.push(errorGramm);
                }
            }
        }else {
            //error
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la asignacion << ${this.token} ${this.asignation.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC);
            handlerComprobation.listError.push(errorGramm);
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
