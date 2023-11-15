package Pila;

@Getter
public class Pila {
    private int size;
    private int[] arregloPila;
    private int tope;

    public Pila(int size) {
        this.size = size;
        //int [][] arregloPila2 = new int[size][size];
        arregloPila = new int[size];
        tope = 0;
    }
    
    
    
    public void apilar(int elemento) {
        if (estaLlena()) {
            System.out.println("La pila esta llena.");
        } else {
	    arregloPila[tope] = elemento;
	    tope++;
        }
    }
    
    public int desapilar() {
        if (estaVacia()) {
            System.out.println("La pila esta vacia, nada que desapilar.");
            return 0;
        }
        tope--;
        int elemento = arregloPila[tope];
        
        return elemento;
    }
    
    public boolean estaLlena() {
        return tope == size;
    }
    
    public boolean estaVacia() {
        return tope == 0;
    }
    
    public int getSize() {
    	return size;
    }
}
