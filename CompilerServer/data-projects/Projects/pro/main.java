package pro;

void main(){
  int num1 = 4;
  int num2 = 2;
  System.out.println("Hello and welcome!");
  System.out.println('H');
  int val1 = num2;
  int val2 = 3;
  int valRes = (4/5)*(val1 * 2)+5-val2;
  System.out.println("Resultado: "+ valRes);
  boolean bol111 = val1 <= valRes;
  boolean bol12 = val1<=valRes;
  boolean bol13 = (val1*2<=valRes);
  boolean bol1 = (val1*2<=valRes*5);
  boolean bol3 = (val1*2>=valRes*val2);
  boolean resBol = bol1 || bol3;
  boolean resBol1 = bol1 && bol3;
  boolean resBol123 = bol1 && bol3 && bol13 || bol12 && bol13 || !bol1;
  boolean resBolTotal = val1<val2 && bol3 || val2<val1 && !resBol1 || resBol;
}
