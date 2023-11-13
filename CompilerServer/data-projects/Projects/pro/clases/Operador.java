package pro.clases;

@Getter @Setter
public class Operador {
	private int id;
  	private int r;

	void main() {
      int a = 3;
      int b = 2;
      int c = (2*5)+a*b/a*2;
      float res = Math.abs(c);
      System.out.println(res);
      res = Math.ceil(c);
      System.out.println(res);
      res = Math.floor(c);
      System.out.println(res);
      res = Math.round(c);
      System.out.println(res);
      res = Math.sqrt(c);
      System.out.println(res);
      res = Math.toRadians(c);
      System.out.println(res);
      res = Math.round(c);
      System.out.println(res);
      res = Math.acos(c);
      System.out.println(res);
      res = Math.sin(c);
      System.out.println(res);
      res = Math.atan(c);
      System.out.println(res);
      res = Math.exp(c);
      System.out.println(res);
      
	}

	public Operador(int id){
		this.id = id;
    }

	public void pintar(){
      	System.out.print("id: ");
      	System.out.println(getId());
        int val1 = 4;
        int val2 = 3;
        float valRes = (4/5)*(val1 * 2)+5-val2;
        System.out.print("Resultado: ");
      	System.out.println(valRes);
        boolean bol111 = val1 <= valRes;
        boolean bol12 = val1<=valRes;
        boolean bol13 = (val1*2<=valRes);
	}

	public int getId(){
		return this.id;
	}
}