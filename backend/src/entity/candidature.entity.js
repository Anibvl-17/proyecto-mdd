"use strict";

import { EntitySchema } from "typeorm";

// Postulación de un vecino a una elección
export const CandidatureEntity = new EntitySchema({
  name: "Candidature",
  tableName: "candidatures",

  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    fechaPostulacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },

  relations: {
    vecino: {
      type: "many-to-one", 
      target: "User",
      joinColumn: true,
      nullable: false,
      onDelete: "CASCADE", 
    },
    eleccion: {
      type: "many-to-one", 
      target: "Election",
      joinColumn: true,
      nullable: false,
      onDelete: "CASCADE", 
    },
  },
});
