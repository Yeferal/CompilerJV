(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("../../node_modules/codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
      define(["../../node_modules/codemirror/lib/codemirror"], mod);
    else // Plain browser env
      mod(CodeMirror);
})(function(CodeMirror) {
"use strict";


CodeMirror.defineMode('milenguaje', function () {
    return {
      token: function (stream) {
        // Definir aquí las reglas de resaltado para tu lenguaje
        // Por ejemplo, puedes resaltar palabras clave 'if', 'else', operadores, cadenas, etc.
        // Puedes utilizar stream.match() para reconocer patrones en el código
        // Devuelve un estilo CSS para cada token que quieras resaltar
  
        // Ejemplo muy básico: Resaltar la palabra clave 'hola'
        if (stream.match('hola')) {
          return 'mi-lenguaje-keyword'; // Clase CSS para resaltar palabras clave
        }
  
        stream.next();
        return null;
      },
    };
});

});