"use strict";

import { EntitySchema } from "typeorm";

// Representa una elección en el sistema.
export const ElectionEntity = new EntitySchema({
  name: "Election",
  tableName: "elections",

  // Definición de columnas
  columns: {
    id: { type: Number, primary: true, generated: true },


    // nombre eliminado, revertido a estado original

    fecha: { type: "date", nullable: false },
    periodo: { type: Number, nullable: false },
    activa: { type: Boolean, default: true },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: () => "CURRENT_TIMESTAMP", 
    },
  },
});
