
const generate3DTHead = (listTempsString) => {
    let text = "";
    text += "#include <stdio.h>\n"
    text += "#include <string.h>\n"
    text += "#include <math.h>\n"
    text += "#include <stdlib.h>\n"
    text += "#include <time.h>\n\n"
    text += "float stack[3000];\n"
    text += "float heap[3000];\n"
    text += "char *stackS[3000];\n"
    text += "int ptr = 0;\n"
    text += "int h = 0;\n"
    text += "int ps = 0;\n"
    
    return text;
}

const generate3DTInt = (listTempsInt) => {
    let text = "";
    for (let i = 0; i < listTempsInt.length; i++) {
        text += "int t"+listTempsInt[i]+";\n"
        
    }
    return text;
}

const generate3DTFloat = (listTempsFloat) => {
    let text = "";
    for (let i = 0; i < listTempsFloat.length; i++) {
        text += "float t"+listTempsFloat[i]+";\n"
        
    }
    return text;
}

const generate3DTString = (listTempsString) => {
    let text = "";
    for (let i = 0; i < listTempsString.length; i++) {
        text += "char t"+listTempsString[i]+"[50];\n"
    }
    return text;
}

const generate3DQuartet = (listQuartet) => {
    let text = "";
    for (let i = 0; i < listQuartet.length; i++) {
        text += getText3dQuartet(listQuartet[i])+"\n";
    }
    return text;
}

const getText3dQuartet = (quartet) => {
    switch(quartet.operator){
        // Para comentarios
        case "comment":
            return "\/\/ " + quartet.arg1 + ";";
        // Para una sola asignacion
        case "=":
            return quartet.result + " = " + quartet.arg1 + ";";
        case "=f":
            return quartet.result + " = (float)" + quartet.arg1 + ";";
        case "=i":
            return quartet.result + " = (int)" + quartet.arg1 + ";";
        case "=s":
            return "strcpy(" + quartet.result + ", " + quartet.arg1 + ");";
        // Aritmeticos
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
            return quartet.result + " = " + quartet.arg1 + " " + quartet.operator + " " + quartet.arg2 + ";";

        case "+f":
        case "-f":
        case "*f":
        case "/f":
        case "%f":
            return quartet.result + " = (float)" + quartet.arg1 + " " + quartet.operator.slice(0, -1) + " (float)" + quartet.arg2 + ";";

        case "+i":
        case "-i":
        case "*i":
        case "/i":
        case "%i":
            return quartet.result + " = (int)" + quartet.arg1 + " " + quartet.operator.slice(0, -1) + " (int)" + quartet.arg2 + ";";

        // Concatenacion
        case "concat":
            return "sprintf(" + quartet.result + ", " + quartet.arg1 + ", " + quartet.arg2 + ");";
        case "concat_s":
            return "strcat(" + quartet.result + ", " + quartet.arg1 + ");";
        
        // Print
        case "printfsimple":
            return "printf( " + quartet.arg1 + " );";
        case "printf":
            return "printf( " + quartet.arg1 + ", "+quartet.arg2+" );";
        case "printff":
            return "printf( \"" + quartet.arg1 + "%f\", "+quartet.arg2+" );";
        case "printfi":
            return "printf( \"" + quartet.arg1 + "%d\", "+quartet.arg2+" );";
        case "printfs":
            return "printf( \"" + quartet.arg1 + "%s\", "+quartet.arg2+" );";
        case "printfc":
            return "printf( \"" + quartet.arg1 + "%c\", "+quartet.arg2+" );";
        
        // Inputs
        case "scanf":
            return "scanf(\"" + quartet.arg1 + "\", &" + quartet.result + ");";
        case "scanff":
            return "scanf(\"" + quartet.arg1 + "\", &" + quartet.result + ");";
        case "scanfi":
            return "scanf(\"" + quartet.arg1 + "\", &" + quartet.result + ");";
        case "scanfs":
            return "scanf(\"" + quartet.arg1 + "\", &" + quartet.result + ");";
        case "clear_buf":
            return `while (getchar() != '\\n');`;

        // Rationales
        case "<=":
        case ">=":
        case "==":
        case "!=":
        case "<":
        case ">":
        case "<=":
            return quartet.result + " = " + quartet.arg1 + " " + quartet.operator + " " + quartet.arg2 + ";";

        // Logicos
        case "&&":
        case "||":
        case "!":

        case "if_equals":
            return "if ( " + quartet.arg1 + " == " + quartet.arg2 + " ) " + " goto " + quartet.result + ";";
        case "if_simple":
            return "if ( " + quartet.arg1 + " ) " + " goto " + quartet.result + ";";


        //jump / goto
        case "jump":
        case "goto":
            return "goto " + quartet.result + ";";

        // label / etiqueta
        case "label":
            return quartet.result + ":";

        case "constructor":
        return "void " + quartet.arg1 + "_" + quartet.arg2 + "() {";

        case "main":
            return "void main() {";

        // function => func, nameCode, type(void, int, etc), paramstype(int_int_string)
        case "function":
            return "void " + quartet.arg1 + "_" + quartet.arg2 + "_" + quartet.result + "() {";
        case "function_declar":
            return "void " + quartet.arg1 + "(void);";
        // return -> (ret, t1, , )

        // close func
        case "close":
            return "}\n";
        //param

        case "call_func":
            return quartet.arg1+"();";

        // stack asign (stack, tx, null, tpstack)
        case "stack_asig":
            return "stack[" + quartet.result + "] = " + quartet.arg1 + ";";
        case "stack_asig_f":
            return "stack[" + quartet.result + "] = (float)" + quartet.arg1 + ";";
        case "stack_asig_i":
            return "stack[" + quartet.result + "] = (int)" + quartet.arg1 + ";";
        
        // stack declaration (stack, tpstack, null, tx)
        case "stack_declar":
            return quartet.result + " = stack[" + quartet.arg1 + "];";
        case "stack_declar_f":
            return quartet.result + " = (float)stack[" + quartet.arg1 + "];";
        case "stack_declar_i":
            return quartet.result + " = (int)stack[" + quartet.arg1 + "];";

        // heap asign (heap, tx, null, tpstack)
        case "heap_asig":
            return "heap[" + quartet.result + "] = " + quartet.arg1 + ";";
        case "heap_asig_f":
            return "heap[" + quartet.result + "] = (float)" + quartet.arg1 + ";";
        case "heap_asig_i":
            return "heap[" + quartet.result + "] = (int)" + quartet.arg1 + ";";
        
        // heap declaration (heap, tpstack, null, tx)
        case "heap_declar":
            return quartet.result + " = heap[" + quartet.arg1 + "];";
        case "heap_declar_f":
            return quartet.result + " = (float)heap[" + quartet.arg1 + "];";
        case "heap_declar_i":
            return quartet.result + " = (int)heap[" + quartet.arg1 + "];";


        // stack asign (stack, tx, null, tpstack)
        case "stack_string_asig":
            return "stackS[" + quartet.result + "] = " + quartet.arg1 + ";";
        // case "stack_string_asig_f":
        //     return "stackS[" + quartet.result + "] = (float)" + quartet.arg1 + ";";
        // case "stack_string_asig_i":
        //     return "stackS[" + quartet.result + "] = (int)" + quartet.arg1 + ";";
        
        // stack declaration (stack, tpstack, null, tx)
        case "stack_string_declar":
            return quartet.result + " = stackS[" + quartet.arg1 + "];";
        // case "stack_string_declar_f":
        //     return quartet.result + " = (float)stackS[" + quartet.arg1 + "];";
        // case "stack_string_declar_i":
        //     return quartet.result + " = (int)stackS[" + quartet.arg1 + "];";

        case "acos":
            return quartet.result + " = (float)acos(" + quartet.arg1 + ");";
        case "asin":
            return quartet.result + " = (float)sin(" + quartet.arg1 + ");";
        case "atan":
            return quartet.result + " = (float)atan(" + quartet.arg1 + ");";
        case "exp":
            return quartet.result + " = (float)exp(" + quartet.arg1 + ");";
        case "srand":
            return "srand((unsigned int)time(NULL));"
        case "rand":
            return quartet.result + " = (float)" + quartet.arg1 + " / " + "(float)" + quartet.arg2 + ";";
    }
    return "";
}


module.exports = {
    generate3DTHead,
    generate3DTInt,
    generate3DTFloat,
    generate3DTString,
    generate3DQuartet,
    getText3dQuartet,
}