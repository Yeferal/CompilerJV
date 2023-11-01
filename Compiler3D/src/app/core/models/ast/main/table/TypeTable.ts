import { DynamicDataType } from "../utils/DynamicDataType";

export class TypeTable {
    table: DynamicDataType [] = [];

    constructor(){
        this.table = [
            new DynamicDataType(0,"NULL", 0),
            new DynamicDataType(1,"FLOAT", 1),
            new DynamicDataType(2,"INTEGER", 1),
            new DynamicDataType(3,"CHAR", 1),
            new DynamicDataType(4,"STRING", 1),
            new DynamicDataType(5,"BOOLEAN", 1),
            // new DynamicDataType(6,"IDENTIFIED", 1),
            // new DynamicDataType(7,"NULL", 0),
            new DynamicDataType(8,"ARRAY", 1),
            // new DynamicDataType(9,"FUNCTION", 1),
            new DynamicDataType(10,"VOID", 1)
        ];
    }

    isExistType(nameType: string): boolean{
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].name === nameType) {
                return true;
            }
        }
        return false;
    }

    getDataType(nameType: string): DynamicDataType {
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].name === nameType) {
                return this.table[i];
            }
        }
        return null;
    }

    addType(dataType: DynamicDataType): boolean{
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].name === dataType.name) {
                //Retorna un false, porque ya existe uno con ese nombre
                return false;
            }
        }
        //NO EXISTE Ninguno con ese nombre, por lo tento puede ser agregado
        this.table.push(dataType);
        //Retorna un true que fue exitoso
        return true;
    }

    setSizeType(nameType: string, size: number): boolean{
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].name === nameType) {
                this.table[i].size = size;
                return true;
            }
        }
        return false;
    }

}