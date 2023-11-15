package lista;


import lista.Nodo;

/**
 *
 * @author jose
 */
public class ListaDoble {
    private Nodo primero;
    private Nodo ultimo;
    private int size;
    
    public void agregar(int contenido) {
        Nodo nuevoNodo = new Nodo(contenido);
        if (esVacia()) {
            primero = nuevoNodo;
            ultimo = nuevoNodo;
        } else {
            ultimo.setSiguiente(nuevoNodo);
            nuevoNodo.setAnterior(ultimo);
            ultimo = nuevoNodo;
        }
       
        size++;
    }
   
    public boolean esVacia() {
      return true;
        //return primero == null;
    }

    public int obtenerContenido(int index) {
      //Nodo node = obtenerNodo(index);
      //int val = node.getContenido();
        //return val;
    }
    
    public void eliminarUltimo() {
        if (esVacia()) {
            System.out.println("La lista esta vacia");
        } else {
            if (size == 1) {
                primero = null;
                ultimo = null;
            } else {
                Nodo penultimo = ultimo.getAnterior();
                penultimo.setSiguiente(null);
                ultimo.setAnterior(null);
                ultimo = penultimo;
            }
        
            size--;
        }
    }
    
    public void imprimirLista() {
        if (esVacia()) {
            System.out.println("La lista esta vacia");
        } else {
        
            Nodo actual = primero;
            //while(actual.getSiguiente() != null) {
                //System.out.println("contenido: " + actual.getContenido());
                //actual = actual.getSiguiente();
            //}
            //System.out.println("contenido: " + actual.getContenido());
        }
    }

    public Nodo obtenerNodo(int index) {
        /*if (esVacia()) {
            System.out.println("La lista esta vacia.");
            //return null;
        }
        if (index >= size || index < 0) {
            System.out.println("El indice esta fuera del tama;o de la lista.");
            //return null;
        }
        
        int medio = size / 2;
        if (index < medio) {
            //return obtenerNodoAvanzando(index);
        } else {
            //return  obtenerNodoRetrocediendo(index);
        }*/
        
    }
    
    private Nodo obtenerNodoAvanzando(int index) {
        Nodo actual = primero;
        for (int i = 0; i < index; i++) {

            actual = actual.getSiguiente();
        }

        return actual;
    }
    
    private Nodo obtenerNodoRetrocediendo(int index) {
        int indiceFinal = size - 1;
        int limite = indiceFinal - index;
        Nodo actual = ultimo;
        for (int i = 0; i < limite; i++) {
            actual = actual.getAnterior();
        }

        return actual;
    }
}
