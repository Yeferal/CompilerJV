import { ErrorType } from "./ErrorType";
import { PositionToken } from "./position-token";

export class ErrorGramm {
    private _positionToken: PositionToken;
    private _token: string;
    private _description: string;
    private _errorType: ErrorType;


	constructor(positionToken: PositionToken, token: string, description: string, errorType: ErrorType) {
		this._positionToken = positionToken;
		this._token = token;
		this._description = description;
		this._errorType = errorType;
	}


    /**
     * Getter positionToken
     * @return {PositionToken}
     */
	public get positionToken(): PositionToken {
		return this._positionToken;
	}

    /**
     * Getter toke
     * @return {string}
     */
	public get token(): string {
		return this._token;
	}

    /**
     * Getter description
     * @return {string}
     */
	public get description(): string {
		return this._description;
	}

    /**
     * Getter errorType
     * @return {ErrorType}
     */
	public get errorType(): ErrorType {
		return this._errorType;
	}

    /**
     * Setter positionToken
     * @param {PositionToken} value
     */
	public set positionToken(value: PositionToken) {
		this._positionToken = value;
	}

    /**
     * Setter toke
     * @param {string} value
     */
	public set token(value: string) {
		this._token = value;
	}

    /**
     * Setter description
     * @param {string} value
     */
	public set description(value: string) {
		this._description = value;
	}

    /**
     * Setter errorType
     * @param {ErrorType} value
     */
	public set errorType(value: ErrorType) {
		this._errorType = value;
	}

    public toString(): string {
        return "Fila: "+ "<<"+this.positionToken.row+">>"+
        "\nColumna: "+ "<<"+this.positionToken.column+">>"+
        "\nToken: "+ "<<"+this.token+">>"+
        "\nDescripcion: "+ "<<"+this.description+">>"+
        "\nErrorType: "+ "<<"+this.errorType.toString()+">>";
    }

}
