package Pila;

import Pila.Pila;

public class Main {

	void main() {
	    Pila pila = new Pila(6);
	    
	    pila.desapilar();
	    pila.apilar(11);
        pila.apilar(12);
        pila.apilar(13);
        int el = pila.desapilar();
        System.out.print("Desapilando: ");
        System.out.println(el);
        pila.apilar(14);
        pila.apilar(15);
        pila.apilar(16);
        pila.apilar(17);
        el = pila.desapilar();
        System.out.print("Desapilando: ");
        System.out.println(el);
        pila.apilar(18);
        pila.apilar(19);
        System.out.print("size: ");
  		System.out.println(pila.getSize());
	}
}
