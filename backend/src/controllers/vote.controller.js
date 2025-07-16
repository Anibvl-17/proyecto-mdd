"use strict";

import { VoteEntity } from "../entity/vote.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { registerVoteValidation } from "../validations/election.validation.js";
import User from "../entity/user.entity.js";

//registrar un voto de un vecino en una elección
export async function registerVote(req, res) {
  try {
    const { vecinoId, eleccionId } = req.body;

    const { error } = registerVoteValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    // Verifica que el vecino exista en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const vecino = await userRepository.findOne({ where: { id: vecinoId } });
    if (!vecino) return res.status(404).json({ message: "Vecino no registrado" });

    const voteRepository = AppDataSource.getRepository(VoteEntity);

    // Verifica si el vecino ya ha votado en esa elección
    const yaVoto = await voteRepository.findOne({
      where: { vecino: { id: vecinoId }, eleccion: { id: eleccionId } },
    });
    if (yaVoto) return res.status(409).json({ message: "Ya ha votado en esta elección" });

    // Crea una nueva instancia de voto con los datos proporcionados
    const voto = voteRepository.create({
      vecino: { id: vecinoId },
      eleccion: { id: eleccionId },
      presencial: true, 
    });

    // Guarda el voto en la base de datos
    await voteRepository.save(voto);

    res.status(201).json({ message: "Voto registrado exitosamente", data: voto });

  } catch (error) {
    console.error("Error en vote.controller.js -> registerVote():", error);
    res.status(500).json({ message: "Error al registrar el voto" });
  }
}

