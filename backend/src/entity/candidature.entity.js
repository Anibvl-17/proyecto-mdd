"use strict";

import { EntitySchema } from "typeorm";

// postulación de un vecino a una elección
export const CandidatureEntity = new EntitySchema({

  name: "Candidature",
  tableName: "candidatures",

  columns: {
    id: { type: Number, primary: true, generated: true },

    fechaPostulacion: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
  },

  // Definición de relaciones con otras entidades
  relations: {
    vecino: {
      type: "one-to-one",       
      target: "User",            
      joinColumn: true,          
      nullable: false,           
    },

    // Relación con la elección en la que se postula
    eleccion: {
      type: "many-to-one",       
      target: "Election",        
      joinColumn: true,          
      nullable: false,           
    },
  },
});
