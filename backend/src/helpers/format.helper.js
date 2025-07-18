function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

module.exports = { formatearFecha };
