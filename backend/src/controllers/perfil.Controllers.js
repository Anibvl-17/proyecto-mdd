"use strict";

import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Obtener el perfil del usuario autenticado
export async function getProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user.id; // Se asume que `req.user` viene del middleware de autenticación
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    // Excluir contraseña al devolver el perfil
    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      role: user.role,
      updatedAt: user.updatedAt,
    };

    res
      .status(200)
      .json({ message: "Perfil encontrado.", data: formattedUser });
  } catch (error) {
    console.error("Error en user.controller.js -> getProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Actualizar información personal del usuario autenticado
export async function updateProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user.id; // Se asume autenticación previa

    const { username, email, telefono, direccion } = req.body;
    // Validar que el email no esté ya registrado por otro usuario

    if (email) {
      const existingUser = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });
      if (existingUser && existingUser.id !== userId) {
        return res
          .status(400)
          .json({ message: "El email ya está registrado por otro usuario." });
      }
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Actualizar solo los campos enviados
    user.username = username || user.username;
    user.email = email || user.email;
    user.telefono = telefono || user.telefono;
    user.direccion = direccion || user.direccion;
    user.updatedAt = new Date();

    await userRepository.save(user);

    res
      .status(200)
      .json({ message: "Perfil actualizado exitosamente.", data: user });
  } catch (error) {
    console.error("Error en user.controller.js -> updateProfile(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
