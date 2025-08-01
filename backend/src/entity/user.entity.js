"use strict";

import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        username: {
            type: String,
            unique: true,
            nullable: false,
        },
        rut: {
            type: String,
            unique: true,
            nullable: false,
        },
        email: {
            type: String,
            unique: true,
            nullable: false,
        },
        password: {
            type: String,
            nullable: false,
        },
        role: {
            type: String,
            default: "user",
        },
        createdAt: {
      type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false, 
        },
        expirationDate: {
            type: "timestamp",
            nullable: false,
        },
    },
    relations: {
        certificates: {
            type: "one-to-many",
            target: "Certificate",
            inverseSide: "user",
        },
    },
});

export default UserEntity;