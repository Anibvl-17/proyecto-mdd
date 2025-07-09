"use strict";

import {EntitySchema} from "typeorm";

export const PetitionEntity = new EntitySchema({
    name: "Petition",
    tableName: "petitions",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        title:{
            type: String,
            nullable: true,
        },
        description: {
            type: String,
            nullable: false,
        },
        revised: {
            type: Boolean,
            nullable: false,
            default: false,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
    },
});

export default PetitionEntity;