"use strict";

import { CandidatureEntity } from "../entity/candidature.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { registerCandidatureValidation } from "../validations/election.validation.js";
import User from "../entity/user.entity.js";

// registrar una candidatura de un vecino en una elección.
export async function registerCandidature(req, res) {
  try {
    let { vecinoId, eleccionId, vecinoNombre } = req.body;

    
    if (!vecinoId && vecinoNombre) {
      const userRepository = AppDataSource.getRepository(User);
      const vecino = await userRepository.findOne({ where: { username: vecinoNombre } });
      if (!vecino) return res.status(404).json({ message: "Vecino no registrado" });
      vecinoId = vecino.id;
    }

    if (!vecinoId) return res.status(400).json({ message: "El id o nombre del vecino es obligatorio" });

    const { error } = registerCandidatureValidation.validate({ vecinoId, eleccionId });
    if (error) return res.status(400).json({ message: error.message });

    
    const userRepository = AppDataSource.getRepository(User);
    const vecino = await userRepository.findOne({ where: { id: vecinoId } });
    if (!vecino) return res.status(404).json({ message: "Vecino no registrado" });

    const repo = AppDataSource.getRepository(CandidatureEntity);

    
    const yaPostulado = await repo.findOne({
      where: { vecino: { id: vecinoId }, eleccion: { id: eleccionId } },
    });
    if (yaPostulado) return res.status(409).json({ message: "Ya está postulado en esta elección" });

   
    const candidatura = repo.create({
      vecino: { id: vecinoId },
      eleccion: { id: eleccionId },
    });

    
    await repo.save(candidatura);

    res.status(201).json({ message: "Candidatura registrada", data: candidatura });

  } catch (error) {
    console.error("Error en candidature.controller.js -> registerCandidature():", error);
    res.status(500).json({ message: "Error al registrar candidatura" });
  }
}

// Obtener postulantes por elección
export async function getCandidaturesByElection(req, res) {
  try {
   
    const eleccionId = Number(req.params.id);

    const repo = AppDataSource.getRepository(CandidatureEntity);

   
    const candidaturas = await repo.find({
      where: { eleccion: { id: eleccionId } },
      relations: ["vecino", "eleccion"], 
    });

    res.status(200).json({ candidaturas });
  } catch (error) {
    console.error("Error en getCandidaturesByElection:", error);
    res.status(500).json({ message: "Error al obtener postulantes" });
  }
}
