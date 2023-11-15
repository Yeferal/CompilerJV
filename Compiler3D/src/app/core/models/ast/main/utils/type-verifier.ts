import { DynamicDataType } from "./DynamicDataType";
import { ArithType } from "./arith-type";
import { LogicalType } from "./logical-type";
import { RationalType } from "./rational-type";


export class TypeVerifier {

    // public verifierTypeArithNode(typeLeft: DynamicDataType, typeRight: DynamicDataType): DynamicDataType{
    //     const typeL = typeLeft.name;
    //     const typeR = typeRight.name;
    //     switch(typeL){
    //         case "FLOAT":
    //             switch (typeR) {
    //                 case "FLOAT":
    //                 case "INTEGER":
    //                 case "CHAR":
    //                     return new DynamicDataType(1,"FLOAT", 1);
    //                 case "BOOLEAN":
    //                 case "STRING":
    //                     return null;
    //                 default:
    //                     return null;
    //             }
    //         case "INTEGER":
    //             switch (typeR) {
    //                 case "FLOAT":
    //                     return new DynamicDataType(1,"FLOAT", 1);
    //                 case "INTEGER":
    //                 case "CHAR":
    //                     return new DynamicDataType(1,"INTEGER", 1);
    //                 case "BOOLEAN":
    //                 case "STRING":
    //                     return null;
    //                 default:
    //                     return null;
    //             }
    //         case "CHAR":
    //             switch (typeR) {
    //                 case "FLOAT":
    //                     return new DynamicDataType(1,"FLOAT", 1);
    //                 case "INTEGER":
    //                     return new DynamicDataType(1,"INTEGER", 1);
    //                 case "CHAR":
    //                     return new DynamicDataType(1,"INTEGER", 1);
    //                 case "STRING":
    //                     return new DynamicDataType(1,"STRING", 1);
    //                 case "BOOLEAN":

    //                     return null;
    //                 default:
    //                     return null;
    //             }
    //         case "BOOLEAN":
    //             switch (typeR) {
    //                 case "FLOAT":
    //                 case "INTEGER":
    //                 case "CHAR":
    //                 case "BOOLEAN":
    //                 case "STRING":
    //                 default:
    //                     return null;
    //             }
    //         case "STRING":
    //             switch (typeR) {
    //                 case "FLOAT":
    //                 case "INTEGER":
    //                 case "CHAR":
    //                 case "BOOLEAN":
    //                 case "STRING":
    //                 default:
    //                     return null;
    //             }
                    
    //     }
    //     return null;
    // }

    public verifierTypeArithNode(typeLeft: DynamicDataType, typeRight: DynamicDataType, typeArith: ArithType): DynamicDataType{
        const typeL = typeLeft.name;
        const typeR = typeRight.name;
        switch(typeArith){
            case ArithType.ADD:
                if ( typeL === "STRING" && 
                    (typeR === "STRING" || 
                     typeR === "FLOAT" || 
                     typeR === "INTEGER" || 
                     typeR === "CHAR" || 
                     typeR === "BOOLEAN")) {
                    return new DynamicDataType(4, "STRING", 1);
                }

                if (typeL === "FLOAT" && typeR === "STRING") {
                    return new DynamicDataType(4,"STRING", 1);
                } else if (typeL === "FLOAT" && typeR === "FLOAT") {
                    return new DynamicDataType(1,"FLOAT", 1);
                } else if (typeL === "FLOAT" && typeR === "INTEGER") {
                    return new DynamicDataType(1,"FLOAT", 1);
                } else if (typeL === "FLOAT" && typeR === "CHAR") {
                    return new DynamicDataType(1,"FLOAT", 1);
                } else if (typeL === "FLOAT" && typeR === "BOOLEAN") {
                    return null;
                }

                if (typeL === "INTEGER" && typeR === "STRING") {
                    return new DynamicDataType(4,"STRING", 1);
                } else if (typeL === "INTEGER" && typeR === "FLOAT") {
                    return new DynamicDataType(1,"FLOAT", 1);
                } else if (typeL === "INTEGER" && typeR === "INTEGER") {
                    return new DynamicDataType(1,"INTEGER", 1);
                } else if (typeL === "INTEGER" && typeR === "CHAR") {
                    return new DynamicDataType(1,"INTEGER", 1);
                } else if (typeL === "INTEGER" && typeR === "BOOLEAN") {
                    return null;
                }

                if (typeL === "CHAR" && typeR === "STRING") {
                    return new DynamicDataType(4,"STRING", 1);
                } else if (typeL === "CHAR" && typeR === "FLOAT") {
                    return new DynamicDataType(1,"FLOAT", 1);
                } else if (typeL === "CHAR" && typeR === "INTEGER") {
                    return new DynamicDataType(1,"INTEGER", 1);
                } else if (typeL === "CHAR" && typeR === "CHAR") {
                    return new DynamicDataType(1,"INTEGER", 1);
                } else if (typeL === "CHAR" && typeR === "BOOLEAN") {
                    return null;
                }

                if (typeL === "BOOLEAN" && typeR === "STRING") {
                    return new DynamicDataType(4,"STRING", 1);
                } else if (typeL === "BOOLEAN" && typeR === "FLOAT") {
                    return null;
                } else if (typeL === "BOOLEAN" && typeR === "INTEGER") {
                    return null;
                } else if (typeL === "BOOLEAN" && typeR === "CHAR") {
                    return null;
                } else if (typeL === "BOOLEAN" && typeR === "BOOLEAN") {
                    return null;
                }
                
                return null;
            case ArithType.SUBTRAC:
                if (typeL === "FLOAT") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                      return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                if (typeL === "INTEGER") {
                    if (typeR === "FLOAT") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    } else if (typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "INTEGER", 1);
                    }
                }

                if (typeL === "CHAR") {
                    if (typeR === "FLOAT") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    } else if (typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "INTEGER", 1);
                    }
                }

                return null;
            case ArithType.MULTI:
                if (typeL === "FLOAT") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                      return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                if (typeL === "INTEGER") {
                    if (typeR === "FLOAT") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    } else if (typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "INTEGER", 1);
                    }
                }

                if (typeL === "CHAR") {
                    if (typeR === "FLOAT") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    } else if (typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "INTEGER", 1);
                    }
                }

                return null;
            case ArithType.DIV:
                if (typeL === "FLOAT") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                      return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                if (typeL === "INTEGER") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                if (typeL === "CHAR") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                return null;
            case ArithType.MOD:
                if (typeL === "FLOAT") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                      return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                if (typeL === "INTEGER") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                if (typeL === "CHAR") {
                    if (typeR === "FLOAT" || typeR === "INTEGER" || typeR === "CHAR") {
                        return new DynamicDataType(1, "FLOAT", 1);
                    }
                }

                return null;
            default:
                return null;
        }
    }

    public verifierTypeRationalNode(typeLeft: DynamicDataType, typeRight: DynamicDataType, rationalType: RationalType): DynamicDataType{
        const typeL = typeLeft.name;
        const typeR = typeRight.name;
        
        
        switch(rationalType){
            case RationalType.EQUAL:
                if (typeL != "FLOAT" && typeL != "INTEGER" && typeL != "STRING" && typeL != "CHAR" && typeL != "BOOLEAN") {
                    if (typeL == "NULL" || typeR == "NULL" || typeL == typeR) {
                        return new DynamicDataType(5,"BOOLEAN", 1);
                    }
                    return null;
                }
                if (typeR != "FLOAT" && typeR != "INTEGER" && typeR != "STRING" && typeR != "CHAR" && typeR != "BOOLEAN") {
                    // if (typeL == "NULL" || typeR == "NUll" || typeL == typeR) {
                    //     return new DynamicDataType(5,"BOOLEAN", 1);
                    // }
                    return null;
                }

                return new DynamicDataType(5,"BOOLEAN", 1);
            case RationalType.EQUAL_OBJ:
                if (typeL == "FLOAT" || typeL == "INTEGER" || typeL == "CHAR" || typeL == "BOOLEAN") {
                    return null;
                }

                if (typeR == "FLOAT" || typeR == "INTEGER" || typeR == "CHAR" || typeR == "BOOLEAN") {
                    return null;
                }

                return new DynamicDataType(5,"BOOLEAN", 1);
            case RationalType.NOT_EQUAL:
                if (typeL != "FLOAT" && typeL != "INTEGER" && typeL != "STRING" && typeL != "CHAR" && typeL != "BOOLEAN") {
                    if (typeL == "NULL" || typeR == "NULL" || typeL == typeR) {
                        return new DynamicDataType(5,"BOOLEAN", 1);
                    }
                    return null;
                }
                if (typeR != "FLOAT" && typeR != "INTEGER" && typeR != "STRING" && typeR != "CHAR" && typeR != "BOOLEAN") {
                    return null;
                }

                return new DynamicDataType(5,"BOOLEAN", 1);
            case RationalType.GRATE_THAN:
                if (typeL != "FLOAT" && typeL != "INTEGER" && typeL != "STRING" && typeL != "CHAR" && typeL != "BOOLEAN") {
                    return null;
                }
                if (typeR != "FLOAT" && typeR != "INTEGER" && typeR != "STRING" && typeR != "CHAR" && typeR != "BOOLEAN") {
                    return null;
                }

                return new DynamicDataType(5,"BOOLEAN", 1);
            case RationalType.GRATE_THAN_EQUAL:
                if (typeL != "FLOAT" && typeL != "INTEGER" && typeL != "STRING" && typeL != "CHAR" && typeL != "BOOLEAN") {
                    return null;
                }
                if (typeR != "FLOAT" && typeR != "INTEGER" && typeR != "STRING" && typeR != "CHAR" && typeR != "BOOLEAN") {
                    return null;
                }
                return new DynamicDataType(5,"BOOLEAN", 1);
            case RationalType.LESS_THAN:
                if (typeL != "FLOAT" && typeL != "INTEGER" && typeL != "STRING" && typeL != "CHAR" && typeL != "BOOLEAN") {
                    return null;
                }
                if (typeR != "FLOAT" && typeR != "INTEGER" && typeR != "STRING" && typeR != "CHAR" && typeR != "BOOLEAN") {
                    return null;
                }

                return new DynamicDataType(5,"BOOLEAN", 1);
            case RationalType.LESS_THAN_EQUAL:
                if (typeL != "FLOAT" && typeL != "INTEGER" && typeL != "STRING" && typeL != "CHAR" && typeL != "BOOLEAN") {
                    return null;
                }
                if (typeR != "FLOAT" && typeR != "INTEGER" && typeR != "STRING" && typeR != "CHAR" && typeR != "BOOLEAN") {
                    return null;
                }

                return new DynamicDataType(5,"BOOLEAN", 1);
        }
        return null;
    }

    public verifierTypeLogicalNode(typeLeft: DynamicDataType, typeRight: DynamicDataType, logicalType: LogicalType): DynamicDataType{
        const typeL = typeLeft.name;
        const typeR = typeRight?.name;
        switch(logicalType){
            case LogicalType.AND:
                if (typeL == "BOOLEAN" && typeR == "BOOLEAN") {
                    return new DynamicDataType(5,"BOOLEAN", 1);
                }
                return null;
            case LogicalType.OR:
                if (typeL == "BOOLEAN" && typeR == "BOOLEAN") {
                    return new DynamicDataType(5,"BOOLEAN", 1);
                }
                return null;
            case LogicalType.NOT:
                if (typeL == "BOOLEAN") {
                    return new DynamicDataType(5,"BOOLEAN", 1);
                }
                return null;
        }
        return null;
    }

    public verifierTypeAsignationNode(varAsig: DynamicDataType, valueAsig: DynamicDataType): DynamicDataType{
        const typeVar = varAsig.name;
        const typeVal = valueAsig.name;
        switch(typeVar){
            case "FLOAT":
                switch(typeVal){
                    case "FLOAT":
                    case "INTEGER":
                    case "CHAR":
                        return new DynamicDataType(1,"FLOAT", 1);
                    default:
                        return null;
                }
            case "INTEGER":
                switch(typeVal){
                    case "FLOAT":
                    case "INTEGER":
                    case "CHAR":
                        return new DynamicDataType(2,"INTEGER", 1);
                    default:
                        return null;
                }
            case "CHAR":
                switch(typeVal){
                    case "FLOAT":
                    case "INTEGER":
                    case "CHAR":
                        return new DynamicDataType(1,"CHAR", 1);
                    default:
                        return null;
                }
            case "STRING":
                switch(typeVal){
                    case "STRING":
                        return new DynamicDataType(3,"STRING", 1);
                    default:
                        return null;
                }
            case "BOOLEAN":
                switch(typeVal){
                    case "BOOLEAN":
                        return new DynamicDataType(3,"BOOLEAN", 1);
                    default:
                        return null;
                }
            default:
                if (typeVar == typeVal) {
                    return new DynamicDataType(1,typeVar, 1);
                } else if (typeVal == "NULL") {
                    return new DynamicDataType(1,typeVar, 1);
                }
        }
        return null;
    }

    public verifierTypeFuncitionNode(typeFunction: DynamicDataType, valueReturn: DynamicDataType): DynamicDataType{
        // const typeL = typeLeft.name;
        // const typeR = typeRight.name;
        // switch(typeL){
        //     case "FLOAT":
        //         switch (typeR) {
        //             case "FLOAT":
        //             case "INTEGER":
        //             case "CHAR":
        //             case "BOOLEAN":
        //             case "STRING":
        //             default:
        //                 return null;
        //         }
        //     case "INTEGER":
        //         switch (typeR) {
        //             case "FLOAT":
        //             case "INTEGER":
        //             case "CHAR":
        //             case "BOOLEAN":
        //             case "STRING":
        //             default:
        //                 return null;
        //         }
        //     case "CHAR":
        //         switch (typeR) {
        //             case "FLOAT":
        //             case "INTEGER":
        //             case "CHAR":
        //             case "BOOLEAN":
        //             case "STRING":
        //             default:
        //                 return null;
        //         }
        //     case "BOOLEAN":
        //         switch (typeR) {
        //             case "FLOAT":
        //             case "INTEGER":
        //             case "CHAR":
        //             case "BOOLEAN":
        //             case "STRING":
        //             default:
        //                 return null;
        //         }
        //     case "STRING":
        //         switch (typeR) {
        //             case "FLOAT":
        //             case "INTEGER":
        //             case "CHAR":
        //             case "BOOLEAN":
        //             case "STRING":
        //             default:
        //                 return null;
        //         }
                    
        // }
        return null;
    }
}
