const { obtenerUsuarioPorId, actualizarPerfil } = require('../models/usuarioModel');

const getPerfil = async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.user.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
};

const updatePerfil = async (req, res) => {
  try {
    const usuarioActualizado = await actualizarPerfil(req.user.id, req.body);
    res.json({ mensaje: 'Perfil actualizado correctamente', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};

module.exports = { getPerfil, updatePerfil };
