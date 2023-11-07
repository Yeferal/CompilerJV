package pro.clases;

import pro.clases.Operador;

public class MathEspecial extends Operador {
  
  private int res;
  
  void main(){
  	int num1= 3;
    int num2= 2;
  }
  
  public MathEspecial(int id, String name, int res) {
  	super(id, name);
    this.res = res;
  }
  
  public float sumar(float num1, float num2){
    return num1 + num2;
  }
  
  @Override
  public void pintar(){
		System.out.println("Resultado: "+ res);
  }
}