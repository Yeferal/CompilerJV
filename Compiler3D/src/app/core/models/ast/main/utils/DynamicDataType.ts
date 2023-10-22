export class DynamicDataType {
    constructor(public id: number, public name: string, public size: number){}
}

const dynamicEnumDataType: DynamicDataType [] = [
    new DynamicDataType(1,"FLOAT", 1),
    new DynamicDataType(2,"INTEGER", 1),
    new DynamicDataType(3,"CHAR", 1),
    new DynamicDataType(4,"STRING", 1),
    new DynamicDataType(5,"BOOLEAN", 1),
    new DynamicDataType(6,"IDENTIFIED", 1),
    new DynamicDataType(7,"ARRAY", 1),
    new DynamicDataType(8,"FUNCTION", 1),
    new DynamicDataType(9,"VOID", 1)
];