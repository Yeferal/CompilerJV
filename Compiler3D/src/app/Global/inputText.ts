export const enterText = 
`@Getter @Setter
public class ClaseFunc {
	private int id;
    int r = (2*5)+2;
    int [][][] arrData = {{{1, 3, 2}, {1, 3, 1}},{{1, 3, 11}, {1, 3, 10}}};
    int [][] arrInstance = new int[2][2];
    private int [][][] arrId = arrData;
    ClaseFunc [] arrClase = new ClaseFunc[4];
	
	private String name;
	String typo = "clase";
    ClaseFunc clase = null;
    ClaseFunc clase2 = new ClaseFunc();

	void main() {
		int a = 3;
		int b = 2;
		int c = (2*5)+a*b/a*2;
		int res = Math.abs(c);
	}

	public ClaseFunc(int id, String name){
		this.id = id;
		this.name = name;
	}

	public void pintar(){
		System.out.println("Nombre: "+ name);
	}

	public int getId(){
		return this.id;
	}
}

`

export const enterText1 = 
`public class Clase1 extends ClasePadre {
    private static int val1;
    private static final int val2;
    public final int val3 = 1;
    @Getter
    @Setter private String valS = "asd";
    public Clase1 [] ar = new Clase1[4];
    @Setter private final static int [][] arr = new int[2][3], [] ads  = new int[3];
    @Getter private boolean bol = (5+5)<val3 || val3>25;

    void main() {
        Clase1 [] ar = new Clase1[4];
        /*int arr [][] new int[2][3], ads [] = new int[3];
            */
        int [][] arr = new int[2][3], [] ads  = new int[3];
        int [][] arre = new int[2][3];
        arre = new int[5][5];
        Clase1 clas = new Clase1(3,4+5/8+3, "daf", 'e');
        arr[0][0]= 4;
        arr[0][2]= 3;
        arre[0][0] = 4;
        var d = 4;
        int a = 3, b = 4, c = 5;
        a++;
        c--;
        c = 4;
        this.clas = new Clase1(3,4+5/8+3, "daf", 'e');
        this.arr[0][0]= 4;
        this.a++;
        this.c--;
        this.c = this.a;
        this.s = b;
        this.clas = cl3;
        this.clas = cs.getText();
        this.clas.text = cs.getText();
        this.clas.setText("fadsfa");

        int d = 5;
        int s = 10;
        if (a == null) {
            if (res.equals(this.val3)){

            } else if (d < s) {

            } else {

            }
        }
    }

    public Clase1(int val1, int val2, String valS) {
        this.val1 = val1;
        this.val2 = val2;
        this.valS = valS;
    }

    Clase1(int val1){
        this.val1 = val1;
    }
    public Clase1(int i, String text, int [] arr){

    }

    public String saludo( int [] arr, Clase1 clas){
        
    }

    public void saludo2( int i, String text, int [] arr){
        toString();
        this.toString();
        a.toString();
        this.a.toString();
    }

    public void condIF(String a){
        int d = 5;
        int s = 10;
        if (a == null) {
            if (res.equals(this.val3)){

            } else if (d < s) {

            } else {

            }
        }
    }

    public void condSwitch(int d){
        switch (d){
            case 0:
                break;
            case 1:
            case 2:
                break;
            case 3:
            default:
                
        }
    }
    // @Override
    // public int condFor() {
    //     int [] arr = {1, 2 , 5 , 8, 2 , 4};
    //     for (int i = 0; i < arr.length; i++) {
    //         System.out.println(arr[i]);
    //     }

    //     for (var i = 0; i < 5 ; i++) {

    //     }
    //     return a;

    // }

    static void condDoWhile(){
        while (true){
            do {
                
            }while (false);
        }
    }


    /**
    * Age of the person. Water is wet.
    *
    * @return The current value of this person's age. Circles are round.
    */
    public int getAge() {
        return age;
    }

    /**
    * Age of the person. Water is wet.
    *
    * @param age New value for this person's age. Sky is blue.
    */
    public void setAge(int age) {
        this.age = age;
    }

    /**
    * Changes the name of this person.
    *
    * @param name The new value.
    */
    public void setName(String name) {
        this.name = name;
    }
}
`


export const enterText2 = 
`void main() {
    
}
`