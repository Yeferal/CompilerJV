export class PositionToken {

    private _row: number;
    private _column: number;
    

	constructor(row: number, column: number) {
		this._row = row;
		this._column = column + 1;
	}

    /**
     * Getter row
     * @return {number}
     */
	public get row(): number {
		return this._row;
	}

    /**
     * Getter column
     * @return {number}
     */
	public get column(): number {
		return this._column;
	}

    /**
     * Setter row
     * @param {number} value
     */
	public set row(value: number) {
		this._row = value;
	}

    /**
     * Setter column
     * @param {number} value
     */
	public set column(value: number) {
		this._column = value;
	}

    
}
