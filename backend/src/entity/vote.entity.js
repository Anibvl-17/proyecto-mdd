
"use strict";

import { EntitySchema } from "typeorm";

// voto emitido por un vecino en una elección.
export const VoteEntity = new EntitySchema({

  name: "Vote",
  tableName: "votes",

  // Definición de columnas
  columns: {
    id: { type: Number, primary: true, generated: true },
    fechaVoto: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    presencial: { type: Boolean, default: true },
  },

  // Índices únicos para evitar votos duplicados por vecino y elección
  indices: [
    {
      name: "IDX_UNIQUE_VECINO_ELECCION",
      columns: ["vecino", "eleccion"],
      unique: true,
    },
  ],

  // Definición de relaciones con otras entidades
  relations: {
    // Relación con el vecino que emitió el voto
    vecino: {
      type: "many-to-one",      
      target: "User",            
      joinColumn: true,          
      nullable: false,           
    },

    // Relación con la elección en la que se votó
    eleccion: {
      type: "many-to-one",       
      target: "Election",        
      joinColumn: true,          
      nullable: false,           
    },
  },
});
