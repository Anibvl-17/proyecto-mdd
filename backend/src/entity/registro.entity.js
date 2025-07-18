const pool = require('../config/db');

const UserEntity = {
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return rows[0];
  },

  async updateById(id, { nombre, correo, telefono, direccion }) {
    const { rows } = await pool.query(
      `UPDATE usuarios
       SET nombre = $1, correo = $2, telefono = $3, direccion = $4, fecha_modificacion = NOW()
       WHERE id = $5
       RETURNING *`,
      [nombre, correo, telefono, direccion, id]
    );
    return rows[0];
  }
};

module.exports = UserEntity;
