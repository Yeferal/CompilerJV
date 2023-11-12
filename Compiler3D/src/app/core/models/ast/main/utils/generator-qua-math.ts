import { Quartet } from "../../../tree-direction/quartet";
import { Environment } from "../environment/environment";
import { RationalOperation } from "../expressions/rational-operation";
import { RationalType } from "./rational-type";

export class GeneratorQuaMath {


    public genABS(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.ABS", arg2: null, result: null});

        const tTempM = environment.addT();

        environment.handlerQuartet.listTempsInt.push(tTempM);
        environment.handlerQuartet.insertQuartet({operator: "<", arg1: tTemp1, arg2: "0", result: "t"+tTempM});     

        const etTempAndTrue = environment.addEt();
        const etTempAndFalse = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM, arg2: null, result: "et"+etTempAndTrue});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue});


        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "*f", arg1: "-1", arg2: tTemp1, result: "t"+tTempMath});  

        const etTempGoto = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        //Lo Falso
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp1, arg2: null, result: "t"+tTempMath});

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempGoto});
        

        
        return "t"+tTempMath;
    }

    public genCEIL(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.CEIL", arg2: null, result: null});

        const tTempInt = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempInt);
        environment.handlerQuartet.insertQuartet({operator: "=i", arg1: tTemp1, arg2: null, result: "t"+tTempInt});

        const tTempM = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTempM);
        environment.handlerQuartet.insertQuartet({operator: "==", arg1: tTemp1, arg2: "t"+tTempInt, result: "t"+tTempM});  
        
        const etTempAndTrue = environment.addEt();
        const etTempAndFalse = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM, arg2: null, result: "et"+etTempAndTrue});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        //Et verdadera
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp1, arg2: null, result: "t"+tTempMath});
        const etTempGoto = environment.addEt();
        //Salto salir de verdadero
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        //Et Falsa
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse});

        //Otro if

        const tTempM2 = environment.addT();

        environment.handlerQuartet.listTempsInt.push(tTempM2);
        environment.handlerQuartet.insertQuartet({operator: "<", arg1: tTemp1, arg2: "0", result: "t"+tTempM2});
        const etTempAndTrue2 = environment.addEt();
        const etTempAndFalse2 = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM2, arg2: null, result: "et"+etTempAndTrue2});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse2});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue2});
        //verdadero
        //Et verdadera
        environment.handlerQuartet.insertQuartet({operator: "=i", arg1: tTemp1, arg2: null, result: "t"+tTempMath});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        //falso
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse2});
        environment.handlerQuartet.insertQuartet({operator: "+i", arg1: tTemp1, arg2: "1", result: "t"+tTempMath});

        // salida
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempGoto});

        

        return "t"+tTempMath;
    }

    public genFLOOR(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.FLOOR", arg2: null, result: null});

        const tTempInt = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempInt);
        environment.handlerQuartet.insertQuartet({operator: "=i", arg1: tTemp1, arg2: null, result: "t"+tTempInt});

        const tTempM = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTempM);
        environment.handlerQuartet.insertQuartet({operator: "==", arg1: tTemp1, arg2: "t"+tTempInt, result: "t"+tTempM});  
        
        const etTempAndTrue = environment.addEt();
        const etTempAndFalse = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM, arg2: null, result: "et"+etTempAndTrue});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        //Et verdadera
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp1, arg2: null, result: "t"+tTempMath});
        const etTempGoto = environment.addEt();
        //Salto salir de verdadero
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        //Et Falsa
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse});

        //Otro if

        const tTempM2 = environment.addT();

        environment.handlerQuartet.listTempsInt.push(tTempM2);
        environment.handlerQuartet.insertQuartet({operator: "<", arg1: tTemp1, arg2: "0", result: "t"+tTempM2});
        const etTempAndTrue2 = environment.addEt();
        const etTempAndFalse2 = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM2, arg2: null, result: "et"+etTempAndTrue2});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse2});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue2});
        //verdadero
        //Et verdadera
        environment.handlerQuartet.insertQuartet({operator: "-i", arg1: tTemp1, arg2: "1", result: "t"+tTempMath});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        //falso
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse2});
        environment.handlerQuartet.insertQuartet({operator: "=i", arg1: tTemp1, arg2: null, result: "t"+tTempMath});

        // salida
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempGoto});

        

        return "t"+tTempMath;
    }

    public genROUND(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.ROUND", arg2: null, result: null});

        const tTempM = environment.addT();

        environment.handlerQuartet.listTempsInt.push(tTempM);
        environment.handlerQuartet.insertQuartet({operator: "<", arg1: tTemp1, arg2: "0", result: "t"+tTempM});     

        const etTempAndTrue = environment.addEt();
        const etTempAndFalse = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM, arg2: null, result: "et"+etTempAndTrue});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue});

        //Verdaderp
        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "-f", arg1: tTemp1, arg2: "0.5", result: "t"+tTempMath});  

        const etTempGoto = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        //Lo Falso
        environment.handlerQuartet.insertQuartet({operator: "+f", arg1: tTemp1, arg2: "0.5", result: "t"+tTempMath});

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempGoto});
        

        
        return "t"+tTempMath;
    }

    public genSQRT(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.SQRT", arg2: null, result: null});

        
        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "=i", arg1: tTemp1, arg2: null, result: "t"+tTempMath});

        return "t"+tTempMath;
    }

    public genToRADIAN(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.TORADIAN", arg2: null, result: null});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);

        environment.handlerQuartet.insertQuartet({operator: "*f", arg1: tTemp1, arg2: "0.017453293", result: "t"+tTempMath}); 

        return "t"+tTempMath;
    }

    public genACOS(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.ACOS", arg2: null, result: null});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);

        environment.handlerQuartet.insertQuartet({operator: "acos", arg1: tTemp1, arg2: null, result: "t"+tTempMath}); 

        return "t"+tTempMath;
    }

    public genSIN(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.SIN", arg2: null, result: null});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);

        environment.handlerQuartet.insertQuartet({operator: "asin", arg1: tTemp1, arg2: null, result: "t"+tTempMath}); 

        return "t"+tTempMath;
    }

    public genATAN(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.TAN", arg2: null, result: null});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);

        environment.handlerQuartet.insertQuartet({operator: "atan", arg1: tTemp1, arg2: null, result: "t"+tTempMath}); 

        return "t"+tTempMath;
    }

    public genEXP(environment: Environment, tTemp1: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.EXP", arg2: null, result: null});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "exp", arg1: tTemp1, arg2: null, result: "t"+tTempMath}); 

        return "t"+tTempMath;
    }


    public genMAX(environment: Environment, tTemp1: string, tTemp2: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.MAX", arg2: null, result: null});

        const tTempM = environment.addT();

        environment.handlerQuartet.listTempsInt.push(tTempM);
        environment.handlerQuartet.insertQuartet({operator: "<", arg1: tTemp1, arg2: tTemp2, result: "t"+tTempM});     

        const etTempAndTrue = environment.addEt();
        const etTempAndFalse = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM, arg2: null, result: "et"+etTempAndTrue});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue});


        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp1, arg2: null, result: "t"+tTempMath});  

        const etTempGoto = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        //Lo Falso
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp2, arg2: null, result: "t"+tTempMath}); 

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempGoto});

        return "t"+tTempMath;
    }

    public genMIN(environment: Environment, tTemp1: string, tTemp2: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.MIN", arg2: null, result: null});

        const tTempM = environment.addT();

        environment.handlerQuartet.listTempsInt.push(tTempM);
        environment.handlerQuartet.insertQuartet({operator: ">", arg1: tTemp1, arg2: tTemp2, result: "t"+tTempM});     

        const etTempAndTrue = environment.addEt();
        const etTempAndFalse = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: "t"+tTempM, arg2: null, result: "et"+etTempAndTrue});
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndTrue});


        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp1, arg2: null, result: "t"+tTempMath});  

        const etTempGoto = environment.addEt();
        environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempGoto});

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempAndFalse});
        //Lo Falso
        environment.handlerQuartet.insertQuartet({operator: "=f", arg1: tTemp2, arg2: null, result: "t"+tTempMath}); 

        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: "et"+etTempGoto});

        return "t"+tTempMath;
    }

    public genPOW(environment: Environment, tTemp1: string, tTemp2: string): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.POW", arg2: null, result: null});

        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "=i", arg1: tTemp1, arg2: null, result: "t"+tTempMath});

        return "t"+tTempMath;
    }

    public genRANDOM(environment: Environment): string {
        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Instricciones del MATH.RANDOM", arg2: null, result: null});

        environment.handlerQuartet.insertQuartet({operator: "srand", arg1: null, arg2: null, result: null});
        
        const tTempMath = environment.addT();
        environment.handlerQuartet.listTempsFloat.push(tTempMath);
        environment.handlerQuartet.insertQuartet({operator: "rand", arg1: "rand()", arg2: "RAND_MAX", result: "t"+tTempMath});

        return "t"+tTempMath;
    }
}