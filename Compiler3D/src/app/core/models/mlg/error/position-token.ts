export class PositionToken {

    private row: number;
    private column: number;
    
	constructor($row: number, $column: number) {
		this.row = $row;
		this.column = $column;
	}

    public getRow(): number {
        return this.row;
    }

    public setRow(row: number): void {
        this.row = row;
    }

    public getColumn(): number {
        return this.column;
    }

    public setColumn(column: number): void {
        this.column = column;
    }


    
}
