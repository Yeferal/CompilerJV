import { ErrorType } from "./ErrorType";
import { PositionToken } from "./position-token";

export class ErrorGramm {
    private positionToken: PositionToken;
    private toke: string;
    private description: string;
    private errorType: ErrorType;

	constructor($positionToken: PositionToken, $toke: string, $description: string, $errorType: ErrorType) {
		this.positionToken = $positionToken;
		this.toke = $toke;
		this.description = $description;
		this.errorType = $errorType;
	}
	

    /**
     * Getter $positionToken
     * @return {PositionToken}
     */
	public get $positionToken(): PositionToken {
		return this.positionToken;
	}

    /**
     * Setter $positionToken
     * @param {PositionToken} value
     */
	public set $positionToken(value: PositionToken) {
		this.positionToken = value;
	}

    /**
     * Getter $toke
     * @return {string}
     */
	public get $toke(): string {
		return this.toke;
	}

    /**
     * Setter $toke
     * @param {string} value
     */
	public set $toke(value: string) {
		this.toke = value;
	}


    /**
     * Getter $description
     * @return {string}
     */
	public get $description(): string {
		return this.description;
	}

    /**
     * Setter $description
     * @param {string} value
     */
	public set $description(value: string) {
		this.description = value;
	}

    /**
     * Getter $errorType
     * @return {ErrorType}
     */
	public get $errorType(): ErrorType {
		return this.errorType;
	}

    /**
     * Setter $errorType
     * @param {ErrorType} value
     */
	public set $errorType(value: ErrorType) {
		this.errorType = value;
	}

}
