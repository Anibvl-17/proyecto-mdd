"use strict";

import { ElectionEntity } from "../entity/election.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createElectionValidation } from "../validations/election.validation.js";

// crear una nueva elección
export async function createElection(req, res) {
  try {
    const { fecha, periodo } = req.body;

    const { error } = createElectionValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const nuevaEleccion = electionRepository.create({ fecha, periodo });

    await electionRepository.save(nuevaEleccion);

    res.status(201).json({ message: "Elección creada exitosamente", data: nuevaEleccion });

  } catch (error) {
    console.error("Error en election.controller.js -> createElection():", error);
    res.status(500).json({ message: "Error al crear la elección" });
  }
}

// obtener todas las elecciones activas.
export async function getActiveElections(req, res) {
  try {
    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const elecciones = await electionRepository.find({ where: { activa: true } });

    res.status(200).json({ message: "Elecciones activas encontradas", data: elecciones });

  } catch (error) {
    console.error("Error en election.controller.js -> getActiveElections():", error);
    res.status(500).json({ message: "Error al obtener elecciones activas" });
  }
}
