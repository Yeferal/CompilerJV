

// Función para generar respuestas JSON comunes
function jsonResponse(status, data, message, error) {
    return {
      status,
      data,
      message,
      error
    };
}

module.exports = {
    jsonResponse
}