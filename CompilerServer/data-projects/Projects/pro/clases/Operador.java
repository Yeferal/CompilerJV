package pro.clases;

@Getter @Setter
public class Operador {
	private int id;
    int r = (2*5)+2;
    int [][][] arrData = {{{1, 3, 2}, {1, 3, 1}},{{1, 3, 11}, {1, 3, 10}}};
    int [][] arrInstance = new int[2][2];
    private int [][][] arrId = arrData;
    Operador [] arrClase = new Operador[4];
	
	private String name;
	String typo = "clase";
    Operador clase = null;
    //Operador clase2 = new Operador();

	void main() {
		int a = 3;
		int b = 2;
		int c = (2*5)+a*b/a*2;
		int res = Math.abs(c);
      
	}

	public ClaseFunc(int id, String name){
		this.id = id;
		this.name = name;
      this.clase.r = 5;
      this.clase.r = a;
      this.clase.clase = new Operator();
      this.clase.clase = new int[4];
      this.clase.clase = new Operator[4];
      this.clase.clase = {4,4,4};
      this.id = this.arrData[0][0][0];
	}

	public void pintar(){
		System.out.println("Nombre: "+ name);
	}

	public int getId(){
		return this.id;
	}
}