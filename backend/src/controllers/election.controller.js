"use strict";

import { ElectionEntity } from "../entity/election.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createElectionValidation } from "../validations/election.validation.js";

// Crear una nueva elección
export async function createElection(req, res) {
  try {
    const { fecha, periodo, activa } = req.body;

    const { error } = createElectionValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const nuevaEleccion = electionRepository.create({ fecha, periodo, activa: typeof activa !== 'undefined' ? activa : true });

    await electionRepository.save(nuevaEleccion);

    res.status(201).json({ message: "Elección creada exitosamente", data: nuevaEleccion });

  } catch (error) {
    console.error("Error en createElection():", error);
    res.status(500).json({ message: "Error al crear la elección" });
  }
}

// Obtener todas las elecciones activas
export async function getActiveElections(req, res) {
  try {
    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const elecciones = await electionRepository.find({ where: { activa: true } });

    res.status(200).json({ message: "Elecciones activas encontradas", data: elecciones });

  } catch (error) {
    console.error("Error en getActiveElections():", error);
    res.status(500).json({ message: "Error al obtener elecciones activas" });
  }
}

// Obtener todas las elecciones (activas e inactivas)
export async function getAllElections(req, res) {
  try {
    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const elecciones = await electionRepository.find();

    res.status(200).json({ message: "Todas las elecciones encontradas", data: elecciones });
  } catch (error) {
    console.error("Error en getAllElections():", error);
    res.status(500).json({ message: "Error al obtener todas las elecciones" });
  }
}

// Actualizar una elección por ID
export async function updateElectionById(req, res) {
  try {
    const { id } = req.params;
    const { fecha, periodo, activa } = req.body;

    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const eleccion = await electionRepository.findOne({ where: { id: parseInt(id) } });

    if (!eleccion) {
      return res.status(404).json({ message: "Elección no encontrada" });
    }

    eleccion.fecha = fecha ?? eleccion.fecha;
    eleccion.periodo = periodo ?? eleccion.periodo;
    if (typeof activa !== 'undefined') {
      eleccion.activa = activa;
    }

    await electionRepository.save(eleccion);
    res.status(200).json({ message: "Elección actualizada correctamente", data: eleccion });

  } catch (error) {
    console.error("Error en updateElectionById():", error);
    res.status(500).json({ message: "Error al actualizar la elección" });
  }
}

// Desactivar una elección (marcar activa = false)
export async function deactivateElectionById(req, res) {
  try {
    const { id } = req.params;
    const electionRepository = AppDataSource.getRepository(ElectionEntity);

    const eleccion = await electionRepository.findOne({ where: { id: parseInt(id) } });

    if (!eleccion) {
      return res.status(404).json({ message: "Elección no encontrada" });
    }

    if (!eleccion.activa) {
      return res.status(400).json({ message: "La elección ya está inactiva" });
    }

    eleccion.activa = false;
    await electionRepository.save(eleccion);

    res.status(200).json({ message: "Elección desactivada correctamente", data: eleccion });

  } catch (error) {
    console.error("Error en deactivateElectionById():", error);
    res.status(500).json({ message: "Error al desactivar la elección" });
  }
}

// Eliminar una elección por ID (solo si está inactiva)
export async function deleteElectionById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const electionRepository = AppDataSource.getRepository(ElectionEntity);
    const eleccion = await electionRepository.findOne({ where: { id } });

    if (!eleccion) {
      return res.status(404).json({ message: "Elección no encontrada" });
    }

    if (eleccion.activa) {
      return res.status(403).json({ message: "No se puede eliminar una elección activa" });
    }

    await electionRepository.delete(id);

    res.status(200).json({ message: "Elección eliminada correctamente" });

  } catch (error) {
    console.error("Error en deleteElectionById():", error);
    res.status(500).json({ message: "Error al eliminar la elección", error: error.message });
  }
}
