"use strict";

import { EntitySchema } from "typeorm";

export const ActivityEntity = new EntitySchema({
  name: "Activity",
  tableName: "activities",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
      nullable: false,
    },
    description: {
      type: String,
      default: () => "'No hay descripción disponible.'",
      // Nota: Sin las comillas simples daba error al crear la base de datos
    },
    date: {
      type: "timestamp",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: () => "CURRENT_TIMESTAMP",
    },
  },
});
