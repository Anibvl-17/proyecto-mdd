"use strict";

import { ActivityEntity } from "../entity/activity.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  createValidation,
  updateValidation,
} from "../validations/activity.validation.js";

export async function getActivities(req, res) {
  try {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    const activities = await activityRepository.find();

    if (!activities)
      return res
        .status(404)
        .json({ message: "No se encontraron actividades." });

    // Las actividades pasadas no son visibles en el sistema, por lo tanto se filtran.
    const visibleActivities = activities.filter((activity) => activity.date > new Date())

    res
      .status(200)
      .json({ message: "Actividades encontradas.", data: visibleActivities });
  } catch (error) {
    console.error(
      "Error en activity.controller.js -> getActivities(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener las actividades" });
  }
}

export async function getActivityById(req, res) {
  try {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    const { id } = req.params;
    const activity = await activityRepository.findOne({ where: { id } });

    if (!activity)
      return res.status(404).json({ message: "No se encontró la actividad." });

    // Recordar que las actividades pasadas no son visibles en el sistema.
    if (activity.date < new Date()) {
      return res.status(403).json({ message: "La actividad ya finalizó." });
    }

    res.status(200).json({ message: "Actividad encontrada", data: activity });
  } catch (error) {
    console.error(
      "Error en activity.controller.js -> getActivityById(): ",
      error
    );
    res.status(500).json({ message: "Error al obtener la actividad." });
  }
}

export async function createActivity(req, res) {
  try {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    const { title, description, date } = req.body;
    const { error } = createValidation.validate(req.body);

    if (error)
      return res
        .status(400)
        .json({ message: "Error al crear la actividad: ", error });

    const newActivity = activityRepository.create({
      title,
      description,
      date,
    });

    await activityRepository.save(newActivity);
    res
      .status(201)
      .json({ message: "Actividad creada exitosamente.", data: newActivity });
  } catch (error) {
    console.error(
      "Error en activity.controller.js -> createActivity(): ",
      error
    );
    res.status(500).json({ message: "Error al crear actividad.", error });
  }
}

export async function updateActivity(req, res) {
  try {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    const { id } = req.params;
    const { title, description, date } = req.body;
    const activity = await activityRepository.findOne({ where: { id } });

    if (!activity)
      return res.status(404).json({ message: "Actividad no encontrada." });

    const { error } = updateValidation.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ message: "Error al actualizar la actividad: ", error });

    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.updatedAt = new Date().toISOString();

    await activityRepository.save(activity);

    res
      .status(200)
      .json({ message: "Actividad actualizada exitosamente.", data: activity });
  } catch (error) {
    console.error(
      "Error en activity.controller.js -> updateActivity(): ",
      error
    );
    res
      .status(500)
      .json({ message: "Error al actualizar la actividad.", error });
  }
}

export async function deleteActivity(req, res) {
  try {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    const { id } = req.params;
    const activity = await activityRepository.findOne({ where: { id } });

    if (!activity)
      return res.status(404).json({ message: "Actividad no encontrada." });

    await activityRepository.remove(activity);

    res.status(200).json({ message: "Actividad eliminada exitosamente." });
  } catch (error) {
    console.error(
      "Error en activity.controller.js -> deleteActivity(): ",
      error
    );
    res.status(500).json({ message: "Error al eliminar la actividad.", error });
  }
}
