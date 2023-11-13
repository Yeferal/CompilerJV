package pro.clases;

import pro.clases.Operador;

public class MathEspecial {
  
  private int res;
  
  public MathEspecial(int id, int res) {
    this.res = res + 5 * 8 / 1;
  }
  
  public float sumar(float num1, float num2){
    var ope = new Operador(10);
    
  	ope.pintar();
  	ope.id = 2;
    ope.pintar();
    ope.id = 13;
    System.out.println(ope.id);
    
    var ope2 = ope;
    ope2.id = 15;
    System.out.println(ope2.id);
    return num1 + num2;
  }
  
  @Override
  public void pintar(){
    System.out.print("Resultado: ");
    System.out.println(res);
  }
}