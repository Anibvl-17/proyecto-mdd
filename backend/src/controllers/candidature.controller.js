"use strict";

import { CandidatureEntity } from "../entity/candidature.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { registerCandidatureValidation } from "../validations/election.validation.js";
import User from "../entity/user.entity.js";

// registrar una candidatura de un vecino en una elección.
export async function registerCandidature(req, res) {
  try {
    const { vecinoId, eleccionId } = req.body;

    const { error } = registerCandidatureValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Verifica que el vecino exista en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const vecino = await userRepository.findOne({ where: { id: vecinoId } });
    if (!vecino) return res.status(404).json({ message: "Vecino no registrado" });

    const repo = AppDataSource.getRepository(CandidatureEntity);

    // Verifica si el vecino ya está postulado en esa elección
    const yaPostulado = await repo.findOne({
      where: { vecino: { id: vecinoId }, eleccion: { id: eleccionId } },
    });
    if (yaPostulado) return res.status(409).json({ message: "Ya está postulado en esta elección" });

    // Crea una nueva candidatura 
    const candidatura = repo.create({
      vecino: { id: vecinoId },
      eleccion: { id: eleccionId },
    });

    // Guarda la candidatura 
    await repo.save(candidatura);

    res.status(201).json({ message: "Candidatura registrada", data: candidatura });

  } catch (error) {
    console.error("Error en candidature.controller.js -> registerCandidature():", error);
    res.status(500).json({ message: "Error al registrar candidatura" });
  }
}
