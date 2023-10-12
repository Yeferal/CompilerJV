import { PositionToken } from "../error/position-token";
import { Environment } from "./environment/environment";
import { HandlerComprobation } from "./environment/handler-comprobation";
import { DataType } from "./utils/DataType";
import { TypeVerifier } from "./utils/type-verifier";

export abstract class Node {

    private _positionToken: PositionToken;
    private _type: DataType;
    private _toke: string;
    public _typeVerifier: TypeVerifier = new TypeVerifier();

    /**
     * @constructor
     * @param positionToken fila y columna del token
     * @param type tipo de dato del token, solo aplica para lo que tenga un tipo de dato
     * @param toke para cuando tenga un token en especifico para los posibles reportes
     */
	constructor(positionToken: PositionToken, type: DataType, toke: string) {
		this._positionToken = positionToken;
		this._type = type;
		this._toke = toke;
	}

    public get positionToken(): PositionToken {
        return this._positionToken;
    }

    public set positionToken(value: PositionToken) {
        this._positionToken = value;
    }

    public get type(): DataType {
        return this._type;
    }

    public set type(value: DataType) {
        this._type = value;
    }

    public get toke(): string {
        return this._toke;
    }
    
    public set toke(value: string) {
        this._toke = value;
    }

    /**
     * @Tipos_de_Comprobaciones 
     * @de_Tipos {a nivel de expresion y a nivel de asignacion}
     * @de_nombres {que exista el simbolo(var, class, function, etc)}
     * @de_ambitos {ambito de la variable, que exista dentro del ambito}
     * @de_flujo_de_control {si existe un break, return, continue}
     * @de_unicidad {los que solo tiene que existir una solo vez}
     * @de_acceso {los public, private, protected}
    */
    public abstract executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any;
    public abstract executeComprobationControlFlow(handlerComprobation: HandlerComprobation): any;
    public abstract executeComprobationAccess(handlerComprobation: HandlerComprobation): any;
    public abstract executeComprobation(handlerComprobation: HandlerComprobation): any;
    public abstract execute(environment: Environment): any;
	


}
