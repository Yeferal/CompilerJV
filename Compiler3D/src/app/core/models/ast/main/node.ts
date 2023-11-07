import { PositionToken } from "../error/position-token";
import { Environment } from "./environment/environment";
import { HandlerComprobation } from "./environment/handler-comprobation";
import { DataType } from "./utils/DataType";
import { DynamicDataType } from "./utils/DynamicDataType";
import { TypeVerifier } from "./utils/type-verifier";

export abstract class Node {

    private _positionToken: PositionToken;
    private _type: DynamicDataType;
    private _token: string;
    public isRunning: boolean = false;
    public isGen3D: boolean = false;
    public _typeVerifier: TypeVerifier = new TypeVerifier();

    /**
     * @constructor
     * @param positionToken fila y columna del token
     * @param type tipo de dato del token, solo aplica para lo que tenga un tipo de dato
     * @param token para cuando tenga un token en especifico para los posibles reportes
     */
	constructor(positionToken: PositionToken, type: DynamicDataType, token: string) {
		this._positionToken = positionToken;
		this._type = type;
		this._token = token;
	}


    /**
     * Getter positionToken
     * @return {PositionToken}
     */
	public get positionToken(): PositionToken {
		return this._positionToken;
	}

    /**
     * Getter type
     * @return {DynamicDataType}
     */
	public get type(): DynamicDataType {
		return this._type;
	}

    /**
     * Getter token
     * @return {string}
     */
	public get token(): string {
		return this._token;
	}

    /**
     * Setter positionToken
     * @param {PositionToken} value
     */
	public set positionToken(value: PositionToken) {
		this._positionToken = value;
	}

    /**
     * Setter type
     * @param {DynamicDataType} value
     */
	public set type(value: DynamicDataType) {
		this._type = value;
	}

    /**
     * Setter token
     * @param {string} value
     */
	public set token(value: string) {
		this._token = value;
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
