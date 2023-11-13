#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>

float stack[3000];
float heap[3000];
char *stackS[3000];
int ptr = 0;
int h = 0;
int ps = 0;
int t0;
int t1;
int t2;
int t3;
int t4;
int t5;
int t6;
int t8;
int t9;
int t11;
int t12;
int t14;
int t17;
int t18;
int t19;
int t20;
int t21;
int t22;
int t23;
int t24;
int t25;
int t26;
int t27;
int t28;
int t29;
int t30;
int t31;
int t32;
int t34;
int t35;
int t36;
int t39;
int t40;
int t42;
int t43;
int t44;
int t45;
int t46;
int t47;
int t48;
int t49;
int t50;
int t51;
int t52;
int t53;
int t54;
int t55;
int t56;
int t57;
int t58;
int t59;
int t60;
int t61;
int t62;
int t63;
int t64;
int t65;
int t66;
int t67;
int t68;
int t69;
int t70;
int t71;
int t72;
int t73;
int t74;
int t75;
int t76;
float t7;
float t10;
float t13;
float t15;
float t16;
float t33;
float t37;
float t38;
float t41;
float t77;
void MathEspecial_MathEspecial(void);
void MathEspecial_sumar_FLOAT_FLOAT_FLOAT(void);
void MathEspecial_pintar_VOID(void);
void Operador_Operador(void);
void Operador_pintar_VOID(void);
void Operador_getId_INTEGER(void);
void MathEspecial_MathEspecial() {
// Obteniendo la posicion de id;
t0 = ptr + 1;
t1 = (int)stack[t0];
// PREPARANDO EL PARAMETRO PARA EL SUPER;
t2 = ptr + 3;
t3 = t2 + 1;
stack[t3] = (int)t1;
ptr = ptr + 3;
Operador_Operador();
ptr = ptr - 3;
t4 = h;
h = h + 1;
t5 = ptr + 0;
stack[t5] = t4;
}

void MathEspecial_sumar_FLOAT_FLOAT_FLOAT() {
// Generadno el if;
// Obteniendo la posicion de num1;
t6 = ptr + 1;
t7 = (float)stack[t6];
t8 = t7 != 0;
if ( t8 )  goto et2;
goto et3;
et2:
// Obteniendo la posicion de num2;
t9 = ptr + 2;
t10 = (float)stack[t9];
t11 = t10 != 0;
if ( t11 )  goto et4;
goto et5;
et4:
// Instricciones del if;
// Obteniendo la posicion de num1;
t12 = ptr + 1;
t13 = (float)stack[t12];
// Obteniendo la posicion de num2;
t14 = ptr + 2;
t15 = (float)stack[t14];
t16 = (float)t13 + (float)t15;
// Obteniendo la posicion del return;
t17 = ptr + 3;
stack[t17] = (float)t16;
goto t1;
goto et6;
et5:
et3:
et6:
// Obteniendo la posicion del return;
t18 = ptr + 3;
stack[t18] = (float)1.0;
goto t1;
t1:
}

void MathEspecial_pintar_VOID() {
printf( "Resultado: " );
// Obteniendo el This;
t19 = ptr + 0;
t20 = (int)stack[t19];
// Obteniendo el valor del res;
t21 = t20 + 0;
t22 = (int)heap[t21];
printf( "%d\n", t22 );
t7:
}

void Operador_Operador() {
t23 = h;
h = h + 2;
t24 = ptr + 0;
stack[t24] = t23;
// Obteniendo la posicion de id;
t25 = ptr + 1;
t26 = (int)stack[t25];
// Obteniendo el This;
t27 = ptr + 0;
t28 = (int)stack[t27];
// Obteniendo el valor del id;
t29 = t28 + 0;
heap[t29] = (int)t26;
}

void Operador_pintar_VOID() {
printf( "id: " );
ptr = ptr + 7;
Operador_getId_INTEGER();
ptr = ptr - 7;
// Obteniendo el valor del return;
t30 = ptr + 7;
t31 = t30 + 2;
t32 = (int)stack[t31];
printf( "%d\n", t32 );
t33 = (float)4 / (float)5;
// Obteniendo la posicion de val1;
t34 = ptr + 1;
t35 = (int)stack[t34];
t36 = (int)t35 * (int)2;
t37 = (float)t33 * (float)t36;
t38 = (float)t37 + (float)5;
// Obteniendo la posicion de val2;
t39 = ptr + 2;
t40 = (int)stack[t39];
t41 = (float)t38 - (float)t40;
printf( "Resultado: " );
// Obteniendo la posicion de valRes;
t42 = ptr + 3;
t43 = (int)stack[t42];
printf( "%d\n", t43 );
// Obteniendo la posicion de val1;
t44 = ptr + 1;
t45 = (int)stack[t44];
// Obteniendo la posicion de valRes;
t46 = ptr + 3;
t47 = (int)stack[t46];
t48 = t45 <= t47;
// Obteniendo la posicion de val1;
t49 = ptr + 1;
t50 = (int)stack[t49];
// Obteniendo la posicion de valRes;
t51 = ptr + 3;
t52 = (int)stack[t51];
t53 = t50 <= t52;
// Obteniendo la posicion de val1;
t54 = ptr + 1;
t55 = (int)stack[t54];
t56 = (int)t55 * (int)2;
// Obteniendo la posicion de valRes;
t57 = ptr + 3;
t58 = (int)stack[t57];
t59 = t56 <= t58;
t8:
}

void Operador_getId_INTEGER() {
// Obteniendo el This;
t60 = ptr + 0;
t61 = (int)stack[t60];
// Obteniendo el valor del id;
t62 = t61 + 0;
t63 = (int)heap[t62];
// Obteniendo la posicion del return;
t64 = ptr + 1;
stack[t64] = (float)t63;
goto t9;
t9:
}

void main() {
// PREPARANDO EL PARAMETRO PARA LA INSTANCIA DE Operador;
t65 = ptr + 1;
t66 = t65 + 1;
stack[t66] = (int)1;
ptr = ptr + 1;
Operador_Operador();
ptr = ptr - 1;
// Obteniendo el valor del constructor o Return;
t67 = ptr + 1;
t68 = t67 + 0;
t69 = (float)stack[t68];
t70 = ptr + 0;
stack[t70] = (float)t69;
// Obteniendo la posicion de ope;
t71 = ptr + 0;
// Obteniendo el valor del ope;
t72 = (int)stack[t71];
t73 = ptr + 1;
t74 = ptr + 0;
stack[t74] = (float)t72;
ptr = ptr + 1;
Operador_pintar_VOID();
ptr = ptr - 1;
// Obteniendo el valor del return;
t75 = ptr + 1;
t76 = t75 + 1;
t77 = (float)stack[t76];
}

